import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken, authRequired, adminRequired } from '../src/middleware/auth.js';
import { errorHandler, notFoundHandler } from '../src/middleware/errorHandler.js';
import { User } from '../src/models/User.js';
import { Post } from '../src/models/Post.js';
import { Poll } from '../src/models/Poll.js';

test('Security & Authentication Tests', async (t) => {
  await t.test('Bcrypt hashes passwords securely and matches correct plain text', async () => {
    const plainPassword = 'secureSecretPassword123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    assert.notEqual(hash, plainPassword);
    const isMatch = await bcrypt.compare(plainPassword, hash);
    assert.equal(isMatch, true);

    const isWrongMatch = await bcrypt.compare('wrongPassword', hash);
    assert.equal(isWrongMatch, false);
  });

  await t.test('JWT token generation and verification', () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      role: 'user',
    };

    const token = generateToken(mockUser);
    assert.ok(token);
    assert.equal(typeof token, 'string');

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secretspace_jwt_dev_secret_key_change_in_prod'
    );
    assert.equal(decoded.id, mockUser._id);
    assert.equal(decoded.role, 'user');
  });

  await t.test('authRequired middleware blocks missing or malformed tokens', async () => {
    const req = { headers: {} };
    let respondedStatus = null;
    let jsonResponse = null;

    const res = {
      status(code) {
        respondedStatus = code;
        return this;
      },
      json(data) {
        jsonResponse = data;
        return this;
      },
    };

    let nextCalled = false;
    await authRequired(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(respondedStatus, 401);
    assert.equal(jsonResponse.success, false);
    assert.equal(jsonResponse.code, 'AUTH_REQUIRED');
  });

  await t.test('adminRequired middleware rejects non-admin users', () => {
    const req = {
      user: {
        _id: '507f1f77bcf86cd799439011',
        role: 'user',
      },
    };

    let respondedStatus = null;
    let jsonResponse = null;

    const res = {
      status(code) {
        respondedStatus = code;
        return this;
      },
      json(data) {
        jsonResponse = data;
        return this;
      },
    };

    let nextCalled = false;
    adminRequired(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(respondedStatus, 403);
    assert.equal(jsonResponse.code, 'FORBIDDEN_NOT_ADMIN');
  });

  await t.test('adminRequired middleware allows admin role', () => {
    const req = {
      user: {
        _id: '507f1f77bcf86cd799439011',
        role: 'admin',
      },
    };

    let nextCalled = false;
    adminRequired(req, {}, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });
});

test('Schema & Validation Unit Tests', async (t) => {
  await t.test('User schema requires valid email and password', async () => {
    const user = new User({ email: 'not-an-email' });
    let err;
    try {
      await user.validate();
    } catch (e) {
      err = e;
    }
    assert.ok(err);
    assert.ok(err.errors.email);
    assert.ok(err.errors.password);
  });

  await t.test('User toJSON removes password hash from serialization', () => {
    const user = new User({
      email: 'student@campus.edu',
      password: 'hashedPasswordString',
      pseudonym: 'Campus Owl #99',
    });

    const json = user.toJSON();
    assert.equal(json.password, undefined);
    assert.equal(json.email, 'student@campus.edu');
    assert.equal(json.pseudonym, 'Campus Owl #99');
  });

  await t.test('Post schema rejects posts longer than 500 characters', async () => {
    const longContent = 'A'.repeat(501);
    const post = new Post({
      content: longContent,
      author: '507f1f77bcf86cd799439011',
      authorPseudonym: 'Anonymous',
    });

    let err;
    try {
      await post.validate();
    } catch (e) {
      err = e;
    }
    assert.ok(err);
    assert.ok(err.errors.content);
    assert.match(err.errors.content.message, /cannot exceed 500 characters/i);
  });

  await t.test('Poll schema requires between 2 and 6 options', async () => {
    const pollTooFew = new Poll({
      question: 'Only one option?',
      options: [{ text: 'Yes' }],
      author: '507f1f77bcf86cd799439011',
      authorPseudonym: 'Anonymous',
    });

    let errFew;
    try {
      await pollTooFew.validate();
    } catch (e) {
      errFew = e;
    }
    assert.ok(errFew);
    assert.ok(errFew.errors.options);

    const pollValid = new Poll({
      question: 'Valid options?',
      options: [{ text: 'Option A' }, { text: 'Option B' }],
      author: '507f1f77bcf86cd799439011',
      authorPseudonym: 'Anonymous',
    });

    let errValid;
    try {
      await pollValid.validate();
    } catch (e) {
      errValid = e;
    }
    assert.equal(errValid, undefined);
  });
});

test('Error Handling & 404 Tests', async (t) => {
  await t.test('404 handler returns structured JSON response', () => {
    const req = { method: 'GET', originalUrl: '/api/nonexistent-endpoint' };
    let jsonOutput = null;
    let statusCode = null;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(payload) {
        jsonOutput = payload;
        return this;
      },
    };

    notFoundHandler(req, res);
    assert.equal(statusCode, 404);
    assert.equal(jsonOutput.success, false);
    assert.equal(jsonOutput.code, 'NOT_FOUND');
  });

  await t.test('Global errorHandler handles CastError smoothly', () => {
    const castErr = new Error('Cast to ObjectId failed');
    castErr.name = 'CastError';
    castErr.value = 'invalid-mongo-id';

    let jsonOutput = null;
    let statusCode = null;

    const res = {
      statusCode: 200,
      status(code) {
        statusCode = code;
        return this;
      },
      json(payload) {
        jsonOutput = payload;
        return this;
      },
    };

    errorHandler(castErr, {}, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonOutput.code, 'INVALID_ID');
    assert.match(jsonOutput.message, /invalid-mongo-id/);
  });
});
