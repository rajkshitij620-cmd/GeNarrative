import bcrypt from 'bcryptjs';
import { memoryStore } from '../services/store.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'artist',
      bio,
      culturalSpecialty,
      preferredLanguage,
      defaultMode
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    // Enforce strictly TWO roles
    if (role !== 'artist' && role !== 'audience') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. RASA CUE supports only two user roles: "artist" and "audience".'
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const existingUser = memoryStore.findUserByEmail(cleanEmail);
    if (existingUser) {
      // If user had an empty password, upgrade and save password now
      if (!existingUser.password) {
        existingUser.name = name.trim() || existingUser.name;
        existingUser.role = role || existingUser.role;
        existingUser.password = await bcrypt.hash(password, 10);
        memoryStore.saveToDisk();
        const token = generateToken(existingUser);
        return res.status(200).json({
          success: true,
          message: `${role.charAt(0).toUpperCase() + role.slice(1)} account activated and logged in.`,
          token,
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            bio: existingUser.bio,
            culturalSpecialty: existingUser.culturalSpecialty,
            accessibilityPreferences: existingUser.accessibilityPreferences,
            savedPerformances: existingUser.savedPerformances || [],
            avatar: existingUser.avatar || ''
          }
        });
      }
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = memoryStore.createUser({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role,
      bio: bio || (role === 'artist' ? 'Performance artist' : 'Art enthusiast & audience member'),
      culturalSpecialty: role === 'artist' ? (culturalSpecialty || 'Classical & Contemporary Arts') : '',
      accessibilityPreferences: {
        preferredLanguage: preferredLanguage || 'English',
        defaultMode: defaultMode || 'visual',
        highContrast: false,
        hapticIntensity: 1.0,
        fontSize: 'normal'
      },
      savedPerformances: [],
      viewingHistory: [],
      avatar: ''
    });

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account registered successfully.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        culturalSpecialty: user.culturalSpecialty,
        accessibilityPreferences: user.accessibilityPreferences,
        savedPerformances: user.savedPerformances,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = memoryStore.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Safety: If legacy DB record has admin role, block access explicitly without silent conversion
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'The Admin role has been deprecated. Only Artist and Audience accounts are supported on RASA CUE.'
      });
    }

    // If account was created without a password, lock in the password now
    if (!user.password) {
      user.password = await bcrypt.hash(password, 10);
      memoryStore.saveToDisk();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        culturalSpecialty: user.culturalSpecialty,
        avatar: user.avatar,
        accessibilityPreferences: user.accessibilityPreferences || {
          preferredLanguage: 'English',
          defaultMode: 'visual',
          highContrast: false,
          hapticIntensity: 1.0,
          fontSize: 'normal'
        },
        savedPerformances: user.savedPerformances || []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    let user = memoryStore.findUserById(req.user.id || req.user._id);
    if (!user && req.user && req.user.email) {
      // Gracefully restore active session user if memory store reloaded
      user = memoryStore.createUser({
        _id: req.user.id || req.user._id,
        name: req.user.name || 'Artist',
        email: req.user.email,
        role: req.user.role || 'artist',
        password: '',
        bio: 'Performance artist',
        culturalSpecialty: 'Classical & Contemporary Arts',
        accessibilityPreferences: {
          preferredLanguage: 'English',
          defaultMode: 'visual'
        }
      });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = memoryStore.findUserById(req.user.id || req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const { name, bio, culturalSpecialty, avatar, accessibilityPreferences } = req.body;
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (culturalSpecialty !== undefined && user.role === 'artist') user.culturalSpecialty = culturalSpecialty;
    if (avatar) user.avatar = avatar;
    if (accessibilityPreferences) {
      user.accessibilityPreferences = {
        ...user.accessibilityPreferences,
        ...accessibilityPreferences
      };
    }

    const { password, ...safeUser } = user;
    res.json({ success: true, message: 'Profile updated successfully.', user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
