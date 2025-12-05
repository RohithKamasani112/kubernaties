// Node.js Debugging Challenges - 55 Comprehensive Scenarios
// Production-Ready Debugging Skills for Node.js Developers

import { DebugChallenge } from './debugPlatformComplete';

export const nodeDebugChallenges: DebugChallenge[] = [
  // ===== ASYNC & PROMISES ISSUES (12 challenges) =====
  
  // 1. Unhandled Promise Rejection
  {
    id: 'node-unhandled-promise-rejection',
    title: 'Unhandled Promise Rejection',
    description: 'Application crashes due to unhandled promise rejections',
    techStack: 'Node.js',
    difficulty: 'beginner',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['Node.js', 'Promises', 'Error Handling', 'Async'],
    rootCause: 'Promise rejections not caught with .catch() or try/catch',
    category: 'Async & Promises',
    files: {
      'server.js': `const express = require('express');
const fs = require('fs').promises;
const app = express();

app.use(express.json());

// BUG: No error handling for promise rejection!
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  
  // This will throw if file doesn't exist
  const userData = await fs.readFile(\`./users/\${userId}.json\`, 'utf8');
  const user = JSON.parse(userData);
  
  res.json(user);
});

// BUG: Another unhandled promise
app.post('/users', (req, res) => {
  const newUser = req.body;
  
  // Promise not awaited or handled
  fs.writeFile(\`./users/\${newUser.id}.json\`, JSON.stringify(newUser))
    .then(() => {
      res.status(201).json({ message: 'User created' });
    });
  // Missing .catch() - if writeFile fails, promise rejection is unhandled!
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      'package.json': `{
  "name": "user-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`
    },
    hints: [
      'Always handle promise rejections with .catch() or try/catch',
      'Use process event listeners for global error handling',
      'Async functions should be wrapped in try/catch blocks',
      'Consider using error handling middleware in Express'
    ],
    solution: {
      'server.js': `const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to gracefully shutdown
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Solution: Proper error handling with try/catch
app.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate input
    if (!userId || !/^\\d+$/.test(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const filePath = path.join(__dirname, 'users', \`\${userId}.json\`);
    const userData = await fs.readFile(filePath, 'utf8');
    const user = JSON.parse(userData);
    
    res.json(user);
  } catch (error) {
    console.error('Error reading user file:', error);
    
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: 'Invalid user data format' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Solution: Proper promise handling
app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    
    // Validate input
    if (!newUser.id || !newUser.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const filePath = path.join(__dirname, 'users', \`\${newUser.id}.json\`);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    await fs.writeFile(filePath, JSON.stringify(newUser, null, 2));
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Express error:', error);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      'package.json': `{
  "name": "user-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`
    },
    testCases: [
      'Test GET /users/123 with non-existent file',
      'Test POST /users with invalid data',
      'Test POST /users with valid data',
      'Verify no unhandled promise rejections in console'
    ],
    debuggingSteps: [
      'Check Node.js console for unhandled rejection warnings',
      'Use try/catch blocks around async operations',
      'Add logging to identify where errors occur',
      'Test error scenarios explicitly'
    ],
    commonMistakes: [
      'Not handling promise rejections in async functions',
      'Missing .catch() on promise chains',
      'Not setting up global error handlers'
    ],
    productionImpact: 'Application crashes and becomes unavailable to users',
    preventionTips: [
      'Always wrap async operations in try/catch',
      'Set up global error handlers for unhandled rejections',
      'Use linting rules to catch missing error handling'
    ]
  },

  // 2. Callback Hell and Race Conditions
  {
    id: 'node-callback-hell',
    title: 'Callback Hell and Race Conditions',
    description: 'Nested callbacks create unreadable code and race conditions',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['Node.js', 'Callbacks', 'Race Conditions', 'Async'],
    rootCause: 'Deeply nested callbacks and improper async flow control',
    category: 'Async & Promises',
    files: {
      'file-processor.js': `const fs = require('fs');
const path = require('path');

class FileProcessor {
  processFiles(inputDir, outputDir, callback) {
    // BUG: Callback hell and race conditions!
    fs.readdir(inputDir, (err, files) => {
      if (err) return callback(err);
      
      let processedCount = 0;
      const results = [];
      
      files.forEach((file, index) => {
        const inputPath = path.join(inputDir, file);
        
        fs.readFile(inputPath, 'utf8', (err, data) => {
          if (err) return callback(err);
          
          // Process data (uppercase)
          const processedData = data.toUpperCase();
          const outputPath = path.join(outputDir, \`processed_\${file}\`);
          
          fs.writeFile(outputPath, processedData, (err) => {
            if (err) return callback(err);
            
            // BUG: Race condition! Multiple callbacks might be called
            processedCount++;
            results[index] = outputPath;
            
            if (processedCount === files.length) {
              // BUG: Results array might have holes due to race conditions
              callback(null, results);
            }
          });
        });
      });
      
      // BUG: What if files array is empty?
      if (files.length === 0) {
        // This might not be reached due to async nature
        callback(null, []);
      }
    });
  }
}

// Usage
const processor = new FileProcessor();
processor.processFiles('./input', './output', (err, results) => {
  if (err) {
    console.error('Processing failed:', err);
    return;
  }
  
  console.log('Processed files:', results);
});

module.exports = FileProcessor;`
    },
    hints: [
      'Use Promise.all() or async/await to handle multiple async operations',
      'Avoid deeply nested callbacks by using promises or async functions',
      'Handle edge cases like empty arrays',
      'Use proper error handling to prevent multiple callback calls'
    ],
    solution: {
      'file-processor.js': `const fs = require('fs').promises;
const path = require('path');

class FileProcessor {
  // Solution 1: Using async/await
  async processFiles(inputDir, outputDir) {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });
      
      const files = await fs.readdir(inputDir);
      
      // Handle empty directory
      if (files.length === 0) {
        return [];
      }
      
      // Process all files concurrently
      const results = await Promise.all(
        files.map(async (file) => {
          const inputPath = path.join(inputDir, file);
          const outputPath = path.join(outputDir, \`processed_\${file}\`);
          
          try {
            const data = await fs.readFile(inputPath, 'utf8');
            const processedData = data.toUpperCase();
            await fs.writeFile(outputPath, processedData);
            
            return outputPath;
          } catch (error) {
            console.error(\`Failed to process \${file}:\`, error);
            throw error;
          }
        })
      );
      
      return results;
    } catch (error) {
      console.error('Processing failed:', error);
      throw error;
    }
  }

  // Solution 2: Using Promises (alternative approach)
  processFilesWithPromises(inputDir, outputDir) {
    return fs.mkdir(outputDir, { recursive: true })
      .then(() => fs.readdir(inputDir))
      .then(files => {
        if (files.length === 0) {
          return [];
        }
        
        const filePromises = files.map(file => {
          const inputPath = path.join(inputDir, file);
          const outputPath = path.join(outputDir, \`processed_\${file}\`);
          
          return fs.readFile(inputPath, 'utf8')
            .then(data => {
              const processedData = data.toUpperCase();
              return fs.writeFile(outputPath, processedData);
            })
            .then(() => outputPath)
            .catch(error => {
              console.error(\`Failed to process \${file}:\`, error);
              throw error;
            });
        });
        
        return Promise.all(filePromises);
      });
  }

  // Solution 3: Sequential processing (if order matters)
  async processFilesSequentially(inputDir, outputDir) {
    try {
      await fs.mkdir(outputDir, { recursive: true });
      const files = await fs.readdir(inputDir);
      const results = [];
      
      for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, \`processed_\${file}\`);
        
        try {
          const data = await fs.readFile(inputPath, 'utf8');
          const processedData = data.toUpperCase();
          await fs.writeFile(outputPath, processedData);
          results.push(outputPath);
        } catch (error) {
          console.error(\`Failed to process \${file}:\`, error);
          throw error;
        }
      }
      
      return results;
    } catch (error) {
      console.error('Sequential processing failed:', error);
      throw error;
    }
  }
}

// Usage with async/await
async function main() {
  const processor = new FileProcessor();
  
  try {
    const results = await processor.processFiles('./input', './output');
    console.log('Processed files:', results);
  } catch (error) {
    console.error('Processing failed:', error);
  }
}

// Usage with promises
function mainWithPromises() {
  const processor = new FileProcessor();
  
  processor.processFilesWithPromises('./input', './output')
    .then(results => {
      console.log('Processed files:', results);
    })
    .catch(error => {
      console.error('Processing failed:', error);
    });
}

if (require.main === module) {
  main();
}

module.exports = FileProcessor;`
    },
    testCases: [
      'Process directory with multiple files',
      'Handle empty input directory',
      'Test with files that cause processing errors',
      'Verify all files are processed correctly'
    ],
    debuggingSteps: [
      'Add logging to track processing flow',
      'Test with different numbers of files',
      'Check for race conditions with concurrent operations',
      'Verify error handling works correctly'
    ],
    commonMistakes: [
      'Not handling empty arrays in async operations',
      'Creating race conditions with shared state',
      'Not properly handling errors in nested callbacks'
    ],
    productionImpact: 'Unreliable file processing, potential data loss, and difficult maintenance',
    preventionTips: [
      'Use async/await or Promise.all() instead of nested callbacks',
      'Handle edge cases like empty arrays',
      'Use proper error handling and logging'
    ]
  },

  // 3. Memory Leak with Event Listeners
  {
    id: 'node-memory-leak-events',
    title: 'Memory Leak with Event Listeners',
    description: 'Server memory usage grows continuously due to event listener leaks',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['Node.js', 'Memory Leak', 'Event Listeners', 'Performance'],
    rootCause: 'Event listeners not properly removed, causing memory accumulation',
    category: 'Memory & Performance',
    files: {
      'websocket-server.js': `const WebSocket = require('ws');
const EventEmitter = require('events');

class ChatRoom extends EventEmitter {
  constructor() {
    super();
    this.users = new Map();
    this.messageHistory = [];
  }

  addUser(userId, ws) {
    this.users.set(userId, ws);
    
    // BUG: Adding listeners without cleanup!
    ws.on('message', (data) => {
      const message = JSON.parse(data);
      this.handleMessage(userId, message);
    });

    ws.on('close', () => {
      this.users.delete(userId);
      // BUG: Not removing other listeners!
    });

    // BUG: Adding listeners to the room for each user
    this.on('newMessage', (message) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });

    // BUG: More listeners that accumulate
    this.on('userJoined', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'userJoined', data }));
      }
    });
  }

  handleMessage(userId, message) {
    const chatMessage = {
      id: Date.now(),
      userId,
      text: message.text,
      timestamp: new Date().toISOString()
    };

    this.messageHistory.push(chatMessage);
    
    // BUG: Message history grows indefinitely
    this.emit('newMessage', chatMessage);
  }

  removeUser(userId) {
    const ws = this.users.get(userId);
    if (ws) {
      // BUG: Not removing all event listeners
      this.users.delete(userId);
    }
  }
}

const wss = new WebSocket.Server({ port: 8080 });
const chatRoom = new ChatRoom();

wss.on('connection', (ws, req) => {
  const userId = req.url.split('?userId=')[1] || \`user_\${Date.now()}\`;
  
  console.log(\`User \${userId} connected\`);
  chatRoom.addUser(userId, ws);
  
  // BUG: No cleanup when connection closes
});

console.log('WebSocket server running on port 8080');

module.exports = { ChatRoom };`
    },
    hints: [
      'Remove event listeners when connections close',
      'Limit message history size to prevent memory growth',
      'Use WeakMap or proper cleanup for user connections',
      'Monitor memory usage with process.memoryUsage()'
    ],
    solution: {
      'websocket-server.js': `const WebSocket = require('ws');
const EventEmitter = require('events');

class ChatRoom extends EventEmitter {
  constructor() {
    super();
    this.users = new Map();
    this.messageHistory = [];
    this.maxHistorySize = 1000; // Limit message history
    this.userListeners = new Map(); // Track listeners per user
  }

  addUser(userId, ws) {
    this.users.set(userId, ws);
    
    // Create bound functions to enable proper cleanup
    const messageHandler = (data) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(userId, message);
      } catch (error) {
        console.error('Invalid message format:', error);
      }
    };

    const closeHandler = () => {
      this.removeUser(userId);
    };

    const errorHandler = (error) => {
      console.error(\`WebSocket error for user \${userId}:\`, error);
      this.removeUser(userId);
    };

    // Add listeners to WebSocket
    ws.on('message', messageHandler);
    ws.on('close', closeHandler);
    ws.on('error', errorHandler);

    // Create room event handlers for this user
    const newMessageHandler = (message) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    };

    const userJoinedHandler = (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'userJoined', data }));
      }
    };

    // Add room listeners
    this.on('newMessage', newMessageHandler);
    this.on('userJoined', userJoinedHandler);

    // Store all handlers for cleanup
    this.userListeners.set(userId, {
      ws,
      messageHandler,
      closeHandler,
      errorHandler,
      newMessageHandler,
      userJoinedHandler
    });

    // Emit user joined event
    this.emit('userJoined', { userId, timestamp: new Date().toISOString() });
  }

  handleMessage(userId, message) {
    const chatMessage = {
      id: Date.now(),
      userId,
      text: message.text,
      timestamp: new Date().toISOString()
    };

    // Add to history with size limit
    this.messageHistory.push(chatMessage);
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift(); // Remove oldest message
    }
    
    this.emit('newMessage', chatMessage);
  }

  removeUser(userId) {
    const userListeners = this.userListeners.get(userId);
    if (!userListeners) return;

    const { ws, messageHandler, closeHandler, errorHandler, newMessageHandler, userJoinedHandler } = userListeners;

    // Remove WebSocket listeners
    ws.removeListener('message', messageHandler);
    ws.removeListener('close', closeHandler);
    ws.removeListener('error', errorHandler);

    // Remove room listeners
    this.removeListener('newMessage', newMessageHandler);
    this.removeListener('userJoined', userJoinedHandler);

    // Clean up maps
    this.users.delete(userId);
    this.userListeners.delete(userId);

    console.log(\`User \${userId} disconnected and cleaned up\`);
  }

  // Method to get memory usage stats
  getStats() {
    return {
      connectedUsers: this.users.size,
      messageHistorySize: this.messageHistory.length,
      totalListeners: this.listenerCount('newMessage') + this.listenerCount('userJoined'),
      memoryUsage: process.memoryUsage()
    };
  }

  // Cleanup method for graceful shutdown
  cleanup() {
    // Remove all users and their listeners
    for (const userId of this.users.keys()) {
      this.removeUser(userId);
    }
    
    // Clear message history
    this.messageHistory = [];
    
    // Remove all listeners
    this.removeAllListeners();
  }
}

const wss = new WebSocket.Server({ port: 8080 });
const chatRoom = new ChatRoom();

wss.on('connection', (ws, req) => {
  const userId = req.url.split('?userId=')[1] || \`user_\${Date.now()}\`;
  
  console.log(\`User \${userId} connected\`);
  chatRoom.addUser(userId, ws);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  chatRoom.cleanup();
  wss.close(() => {
    process.exit(0);
  });
});

// Memory monitoring (for debugging)
setInterval(() => {
  const stats = chatRoom.getStats();
  console.log('Server stats:', stats);
}, 30000); // Log every 30 seconds

console.log('WebSocket server running on port 8080');

module.exports = { ChatRoom };`
    },
    testCases: [
      'Connect multiple users and verify memory doesn\'t grow indefinitely',
      'Disconnect users and verify proper cleanup',
      'Send many messages and verify history size limit',
      'Monitor memory usage over time'
    ],
    debuggingSteps: [
      'Use process.memoryUsage() to monitor memory consumption',
      'Check EventEmitter listener counts',
      'Use Node.js --inspect flag for memory profiling',
      'Test with many connections and disconnections'
    ],
    commonMistakes: [
      'Not removing event listeners when connections close',
      'Allowing unlimited growth of data structures',
      'Not tracking listener references for cleanup'
    ],
    productionImpact: 'Server memory usage grows until crash, affecting all users',
    preventionTips: [
      'Always clean up event listeners when objects are destroyed',
      'Implement size limits for data structures',
      'Monitor memory usage in production'
    ]
  },

  // 4-10: More Async & Promise Issues
  {
    id: 'node-async-await-error-handling',
    title: 'Async/Await Error Handling Issues',
    description: 'Improper error handling in async/await causing silent failures',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '16 min',
    xpReward: 120,
    tags: ['Node.js', 'Async/Await', 'Error Handling', 'Promises'],
    rootCause: 'Missing try/catch blocks and improper error propagation',
    category: 'Async & Promises',
    files: {
      'data-processor.js': `const fs = require('fs').promises;
const path = require('path');

class DataProcessor {
  async processUserData(userId) {
    // BUG: No error handling for async operations!
    const userData = await this.fetchUserData(userId);
    const processedData = await this.transformData(userData);
    const savedPath = await this.saveData(processedData);

    return savedPath;
  }

  async fetchUserData(userId) {
    // Simulate API call that might fail
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (Math.random() < 0.3) {
      throw new Error(\`User \${userId} not found\`);
    }

    return {
      id: userId,
      name: \`User \${userId}\`,
      email: \`user\${userId}@example.com\`,
      data: Array.from({length: 1000}, () => Math.random())
    };
  }

  async transformData(userData) {
    // BUG: Async operation without proper error handling
    const transformed = userData.data.map(async (value) => {
      // Simulate async transformation that might fail
      if (value < 0.1) {
        throw new Error('Invalid data value');
      }
      return value * 2;
    });

    // BUG: Not awaiting Promise.all!
    return {
      ...userData,
      data: transformed
    };
  }

  async saveData(data) {
    const filePath = path.join(__dirname, 'output', \`\${data.id}.json\`);

    // BUG: No error handling for file operations
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return filePath;
  }

  // BUG: Method doesn't handle async errors properly
  async batchProcess(userIds) {
    const results = [];

    for (const userId of userIds) {
      // BUG: If one fails, entire batch fails
      const result = await this.processUserData(userId);
      results.push(result);
    }

    return results;
  }
}

// Usage
async function main() {
  const processor = new DataProcessor();

  // BUG: No error handling in main function
  const result = await processor.processUserData(123);
  console.log('Processed:', result);

  const batchResults = await processor.batchProcess([1, 2, 3, 4, 5]);
  console.log('Batch results:', batchResults);
}

main();

module.exports = DataProcessor;`
    },
    hints: [
      'Always wrap async operations in try/catch blocks',
      'Use Promise.all() correctly for concurrent operations',
      'Handle partial failures in batch operations',
      'Ensure proper error propagation through async chains'
    ],
    solution: {
      'data-processor.js': `const fs = require('fs').promises;
const path = require('path');

class DataProcessor {
  constructor() {
    this.ensureOutputDirectory();
  }

  async ensureOutputDirectory() {
    try {
      const outputDir = path.join(__dirname, 'output');
      await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  async processUserData(userId) {
    try {
      console.log(\`Starting processing for user \${userId}\`);

      const userData = await this.fetchUserData(userId);
      const processedData = await this.transformData(userData);
      const savedPath = await this.saveData(processedData);

      console.log(\`Successfully processed user \${userId}\`);
      return savedPath;
    } catch (error) {
      console.error(\`Failed to process user \${userId}:\`, error.message);
      throw new Error(\`Processing failed for user \${userId}: \${error.message}\`);
    }
  }

  async fetchUserData(userId) {
    try {
      console.log(\`Fetching data for user \${userId}\`);

      // Simulate API call with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });

      const fetchPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.3) {
            reject(new Error(\`User \${userId} not found\`));
          } else {
            resolve({
              id: userId,
              name: \`User \${userId}\`,
              email: \`user\${userId}@example.com\`,
              data: Array.from({length: 1000}, () => Math.random())
            });
          }
        }, 1000);
      });

      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
      console.error(\`Failed to fetch user \${userId}:\`, error.message);
      throw error;
    }
  }

  async transformData(userData) {
    try {
      console.log(\`Transforming data for user \${userData.id}\`);

      // Solution: Properly handle async transformations
      const transformPromises = userData.data.map(async (value, index) => {
        try {
          // Simulate async transformation that might fail
          if (value < 0.1) {
            console.warn(\`Skipping invalid value at index \${index}: \${value}\`);
            return 0; // Default value instead of throwing
          }
          return value * 2;
        } catch (error) {
          console.error(\`Transform error at index \${index}:\`, error);
          return 0; // Fallback value
        }
      });

      // Solution: Properly await all transformations
      const transformedData = await Promise.all(transformPromises);

      return {
        ...userData,
        data: transformedData,
        transformedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(\`Failed to transform data for user \${userData.id}:\`, error);
      throw new Error(\`Data transformation failed: \${error.message}\`);
    }
  }

  async saveData(data) {
    try {
      const filePath = path.join(__dirname, 'output', \`\${data.id}.json\`);

      console.log(\`Saving data to \${filePath}\`);

      // Solution: Proper error handling for file operations
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));

      // Verify file was written
      const stats = await fs.stat(filePath);
      console.log(\`File saved successfully: \${stats.size} bytes\`);

      return filePath;
    } catch (error) {
      console.error(\`Failed to save data for user \${data.id}:\`, error);
      throw new Error(\`File save failed: \${error.message}\`);
    }
  }

  // Solution: Handle partial failures in batch processing
  async batchProcess(userIds, options = {}) {
    const {
      concurrency = 3,
      continueOnError = true,
      retries = 2
    } = options;

    const results = [];
    const errors = [];

    // Process in chunks to control concurrency
    for (let i = 0; i < userIds.length; i += concurrency) {
      const chunk = userIds.slice(i, i + concurrency);

      const chunkPromises = chunk.map(async (userId) => {
        let lastError;

        // Retry logic
        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            const result = await this.processUserData(userId);
            return { userId, success: true, result };
          } catch (error) {
            lastError = error;

            if (attempt < retries) {
              console.log(\`Retrying user \${userId} (attempt \${attempt + 2})\`);
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
          }
        }

        // All retries failed
        const errorResult = {
          userId,
          success: false,
          error: lastError.message
        };

        if (continueOnError) {
          errors.push(errorResult);
          return errorResult;
        } else {
          throw lastError;
        }
      });

      try {
        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
      } catch (error) {
        if (!continueOnError) {
          throw error;
        }
      }
    }

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(\`Batch processing complete: \${successful.length} successful, \${failed.length} failed\`);

    return {
      successful,
      failed,
      total: userIds.length,
      successRate: (successful.length / userIds.length) * 100
    };
  }

  // Utility method for graceful shutdown
  async cleanup() {
    console.log('Cleaning up resources...');
    // Add any cleanup logic here
  }
}

// Solution: Proper error handling in main function
async function main() {
  const processor = new DataProcessor();

  try {
    // Single user processing
    console.log('=== Single User Processing ===');
    const result = await processor.processUserData(123);
    console.log('Processed:', result);

    // Batch processing
    console.log('\\n=== Batch Processing ===');
    const batchResults = await processor.batchProcess([1, 2, 3, 4, 5], {
      concurrency: 2,
      continueOnError: true,
      retries: 1
    });

    console.log('Batch results:', {
      successRate: \`\${batchResults.successRate.toFixed(1)}%\`,
      successful: batchResults.successful.length,
      failed: batchResults.failed.length
    });

    if (batchResults.failed.length > 0) {
      console.log('Failed users:', batchResults.failed.map(f => f.userId));
    }

  } catch (error) {
    console.error('Main execution failed:', error.message);
    process.exit(1);
  } finally {
    await processor.cleanup();
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = DataProcessor;`
    },
    testCases: [
      'Single user processing should handle errors gracefully',
      'Batch processing should continue on individual failures',
      'Retry logic should work correctly',
      'File operations should handle permissions and disk space issues'
    ],
    debuggingSteps: [
      'Add comprehensive logging to track async operations',
      'Use try/catch blocks around all async operations',
      'Test error scenarios explicitly',
      'Monitor memory usage during batch processing'
    ],
    commonMistakes: [
      'Not wrapping async operations in try/catch',
      'Improper use of Promise.all with async map',
      'Not handling partial failures in batch operations',
      'Missing error propagation in async chains'
    ],
    productionImpact: 'Silent failures, data loss, application crashes, poor user experience',
    preventionTips: [
      'Always use try/catch with async/await',
      'Implement proper retry logic for transient failures',
      'Use Promise.allSettled for handling partial failures',
      'Add comprehensive logging and monitoring'
    ]
  },

  {
    id: 'node-stream-backpressure',
    title: 'Stream Backpressure and Memory Issues',
    description: 'Streams not handling backpressure properly causing memory leaks',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['Node.js', 'Streams', 'Backpressure', 'Memory', 'Performance'],
    rootCause: 'Not handling stream backpressure and proper cleanup',
    category: 'Streams & Performance',
    files: {
      'file-processor.js': `const fs = require('fs');
const { Transform, pipeline } = require('stream');
const zlib = require('zlib');

class DataTransformer extends Transform {
  constructor(options) {
    super({ objectMode: true, ...options });
    this.processedCount = 0;
  }

  _transform(chunk, encoding, callback) {
    // BUG: Expensive synchronous operation blocking the stream!
    const processed = this.expensiveProcessing(chunk);

    this.processedCount++;

    // BUG: Not handling backpressure properly!
    this.push(processed);
    callback();
  }

  expensiveProcessing(data) {
    // Simulate CPU-intensive work
    let result = data;
    for (let i = 0; i < 100000; i++) {
      result = JSON.stringify(JSON.parse(JSON.stringify(result)));
    }
    return result;
  }
}

class FileProcessor {
  async processLargeFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(inputPath);
      const writeStream = fs.createWriteStream(outputPath);
      const gzipStream = zlib.createGzip();
      const transformer = new DataTransformer();

      // BUG: Not handling stream errors properly!
      readStream
        .pipe(transformer)
        .pipe(gzipStream)
        .pipe(writeStream);

      writeStream.on('finish', () => {
        console.log('Processing complete');
        resolve(outputPath);
      });

      // BUG: Only handling writeStream errors
      writeStream.on('error', reject);
    });
  }

  async processManyFiles(inputDir, outputDir) {
    const files = fs.readdirSync(inputDir);

    // BUG: Processing all files concurrently without limit!
    const promises = files.map(file => {
      const inputPath = \`\${inputDir}/\${file}\`;
      const outputPath = \`\${outputDir}/processed_\${file}.gz\`;
      return this.processLargeFile(inputPath, outputPath);
    });

    return Promise.all(promises);
  }
}

// Usage
const processor = new FileProcessor();

processor.processLargeFile('./input/large-file.txt', './output/processed.txt.gz')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));

module.exports = { FileProcessor, DataTransformer };`
    },
    hints: [
      'Use pipeline() for proper error handling and cleanup',
      'Handle backpressure with proper flow control',
      'Limit concurrent stream operations',
      'Use async processing in transform streams'
    ],
    solution: {
      'file-processor.js': `const fs = require('fs');
const { Transform, pipeline, Readable } = require('stream');
const { promisify } = require('util');
const zlib = require('zlib');
const path = require('path');

const pipelineAsync = promisify(pipeline);

class DataTransformer extends Transform {
  constructor(options = {}) {
    super({
      objectMode: false,
      highWaterMark: options.highWaterMark || 16 * 1024, // 16KB buffer
      ...options
    });

    this.processedCount = 0;
    this.processingQueue = [];
    this.isProcessing = false;
    this.maxConcurrency = options.maxConcurrency || 2;
  }

  _transform(chunk, encoding, callback) {
    // Solution: Handle backpressure with async processing
    this.processingQueue.push({ chunk, encoding, callback });
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.processingQueue.length > 0) {
      const batch = this.processingQueue.splice(0, this.maxConcurrency);

      // Process batch concurrently
      await Promise.all(batch.map(async ({ chunk, encoding, callback }) => {
        try {
          const processed = await this.expensiveProcessingAsync(chunk);
          this.processedCount++;

          // Solution: Check if stream can handle more data
          const canContinue = this.push(processed);

          if (!canContinue) {
            // Wait for drain event if backpressure detected
            await new Promise(resolve => this.once('drain', resolve));
          }

          callback();
        } catch (error) {
          callback(error);
        }
      }));
    }

    this.isProcessing = false;
  }

  async expensiveProcessingAsync(data) {
    return new Promise((resolve) => {
      // Solution: Use setImmediate to avoid blocking the event loop
      setImmediate(() => {
        try {
          // Simulate CPU-intensive work in smaller chunks
          let result = data;
          let iterations = 0;
          const maxIterations = 1000;

          const processChunk = () => {
            for (let i = 0; i < 100 && iterations < maxIterations; i++, iterations++) {
              // Lighter processing to avoid blocking
              result = Buffer.from(result.toString().toUpperCase());
            }

            if (iterations < maxIterations) {
              setImmediate(processChunk);
            } else {
              resolve(result);
            }
          };

          processChunk();
        } catch (error) {
          resolve(data); // Fallback to original data
        }
      });
    });
  }

  _flush(callback) {
    // Ensure all queued items are processed before ending
    const waitForQueue = () => {
      if (this.processingQueue.length === 0 && !this.isProcessing) {
        callback();
      } else {
        setImmediate(waitForQueue);
      }
    };

    waitForQueue();
  }
}

class FileProcessor {
  constructor(options = {}) {
    this.maxConcurrentFiles = options.maxConcurrentFiles || 3;
    this.chunkSize = options.chunkSize || 64 * 1024; // 64KB chunks
  }

  async processLargeFile(inputPath, outputPath, options = {}) {
    try {
      // Ensure output directory exists
      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

      const readStream = fs.createReadStream(inputPath, {
        highWaterMark: this.chunkSize
      });

      const writeStream = fs.createWriteStream(outputPath);
      const gzipStream = zlib.createGzip({ level: 6 }); // Balanced compression
      const transformer = new DataTransformer({
        highWaterMark: this.chunkSize,
        maxConcurrency: 2
      });

      // Solution: Use pipeline for proper error handling and cleanup
      await pipelineAsync(
        readStream,
        transformer,
        gzipStream,
        writeStream
      );

      // Verify output file
      const stats = await fs.promises.stat(outputPath);
      console.log(\`Processing complete: \${inputPath} -> \${outputPath} (\${stats.size} bytes)\`);

      return {
        inputPath,
        outputPath,
        inputSize: (await fs.promises.stat(inputPath)).size,
        outputSize: stats.size,
        processedChunks: transformer.processedCount
      };

    } catch (error) {
      console.error(\`Failed to process \${inputPath}:\`, error.message);

      // Cleanup partial output file
      try {
        await fs.promises.unlink(outputPath);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }

      throw error;
    }
  }

  async processManyFiles(inputDir, outputDir, options = {}) {
    try {
      const files = await fs.promises.readdir(inputDir);
      const results = [];
      const errors = [];

      // Solution: Process files in controlled batches
      for (let i = 0; i < files.length; i += this.maxConcurrentFiles) {
        const batch = files.slice(i, i + this.maxConcurrentFiles);

        console.log(\`Processing batch \${Math.floor(i / this.maxConcurrentFiles) + 1}: \${batch.join(', ')}\`);

        const batchPromises = batch.map(async (file) => {
          try {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, \`processed_\${file}.gz\`);

            const result = await this.processLargeFile(inputPath, outputPath, options);
            return { success: true, file, result };
          } catch (error) {
            return { success: false, file, error: error.message };
          }
        });

        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach(result => {
          if (result.success) {
            results.push(result);
          } else {
            errors.push(result);
          }
        });

        // Add delay between batches to prevent overwhelming the system
        if (i + this.maxConcurrentFiles < files.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return {
        successful: results,
        failed: errors,
        total: files.length,
        successRate: (results.length / files.length) * 100
      };

    } catch (error) {
      console.error('Failed to process directory:', error.message);
      throw error;
    }
  }

  // Monitor memory usage during processing
  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
      external: Math.round(usage.external / 1024 / 1024) + ' MB'
    };
  }

  // Create a readable stream from array data
  createDataStream(data) {
    let index = 0;

    return new Readable({
      objectMode: true,
      read() {
        if (index < data.length) {
          this.push(data[index++]);
        } else {
          this.push(null); // End of stream
        }
      }
    });
  }
}

// Solution: Proper usage with error handling and monitoring
async function main() {
  const processor = new FileProcessor({
    maxConcurrentFiles: 2,
    chunkSize: 32 * 1024 // 32KB chunks
  });

  try {
    console.log('Initial memory usage:', processor.getMemoryUsage());

    // Process single file
    console.log('=== Single File Processing ===');
    const singleResult = await processor.processLargeFile(
      './input/large-file.txt',
      './output/processed.txt.gz'
    );
    console.log('Single file result:', singleResult);
    console.log('Memory after single file:', processor.getMemoryUsage());

    // Process multiple files
    console.log('\\n=== Batch File Processing ===');
    const batchResult = await processor.processManyFiles('./input', './output');

    console.log('Batch processing summary:');
    console.log(\`- Total files: \${batchResult.total}\`);
    console.log(\`- Successful: \${batchResult.successful.length}\`);
    console.log(\`- Failed: \${batchResult.failed.length}\`);
    console.log(\`- Success rate: \${batchResult.successRate.toFixed(1)}%\`);

    if (batchResult.failed.length > 0) {
      console.log('Failed files:', batchResult.failed.map(f => f.file));
    }

    console.log('Final memory usage:', processor.getMemoryUsage());

  } catch (error) {
    console.error('Processing failed:', error.message);
    process.exit(1);
  }
}

// Memory monitoring
setInterval(() => {
  const processor = new FileProcessor();
  console.log('Memory usage:', processor.getMemoryUsage());
}, 10000);

if (require.main === module) {
  main();
}

module.exports = { FileProcessor, DataTransformer };`
    },
    testCases: [
      'Large file processing should not cause memory leaks',
      'Backpressure should be handled correctly',
      'Multiple file processing should be limited and controlled',
      'Stream errors should be properly handled and cleaned up'
    ],
    debuggingSteps: [
      'Monitor memory usage during stream processing',
      'Use Node.js --inspect flag for memory profiling',
      'Test with large files to verify backpressure handling',
      'Check for proper stream cleanup and error handling'
    ],
    commonMistakes: [
      'Not handling stream backpressure',
      'Processing too many streams concurrently',
      'Not using pipeline() for proper error handling',
      'Blocking the event loop with synchronous operations'
    ],
    productionImpact: 'Memory leaks, application crashes, poor performance, file corruption',
    preventionTips: [
      'Use pipeline() for stream error handling and cleanup',
      'Implement proper backpressure handling',
      'Limit concurrent stream operations',
      'Monitor memory usage in production'
    ]
  },

  // ===== EXPRESS.JS & API ISSUES (12 challenges) =====

  {
    id: 'node-express-middleware-order',
    title: 'Express Middleware Order Issues',
    description: 'Incorrect middleware order causing authentication and CORS failures',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['Node.js', 'Express', 'Middleware', 'Authentication', 'CORS'],
    rootCause: 'Middleware applied in wrong order affecting request processing',
    category: 'Express & APIs',
    files: {
      'server.js': `const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();

// BUG: Middleware order is incorrect!

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// BUG: Applying auth middleware before parsing body!
app.use(authenticateToken);

// BUG: CORS applied after other middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// BUG: Rate limiting applied too late
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/api/login', (req, res) => {
  // BUG: req.body is undefined because body parser comes after auth!
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret');
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/protected', (req, res) => {
  // This route should be protected but auth middleware is applied globally
  res.json({ message: 'Protected data', user: req.user });
});

app.get('/api/public', (req, res) => {
  // BUG: This public route is also protected due to global auth middleware!
  res.json({ message: 'Public data' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;`
    },
    hints: [
      'Apply middleware in correct order: CORS, body parsing, then auth',
      'Use route-specific middleware instead of global where appropriate',
      'Rate limiting should be applied early',
      'Error handling middleware should be last'
    ],
    solution: {
      'server.js': `const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Solution: Correct middleware order

// 1. Security headers (should be first)
app.use(helmet());

// 2. Logging middleware
app.use(morgan('combined'));

// 3. CORS (before any routes)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Rate limiting (early to prevent abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the \`RateLimit-*\` headers
  legacyHeaders: false, // Disable the \`X-RateLimit-*\` headers
});

app.use('/api/', limiter);

// 5. Body parsing middleware (before routes that need it)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Request validation middleware
const validateRequest = (req, res, next) => {
  // Add request validation logic
  if (req.method === 'POST' && req.headers['content-type'] &&
      !req.headers['content-type'].includes('application/json') &&
      !req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
    return res.status(400).json({ error: 'Invalid content type' });
  }
  next();
};

app.use(validateRequest);

// Authentication middleware (only for protected routes)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      code: 'TOKEN_MISSING'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired token',
        code: 'TOKEN_INVALID'
      });
    }
    req.user = user;
    next();
  });
};

// Optional authentication middleware (for routes that can work with or without auth)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// Routes

// Public routes (no authentication required)
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    // In production, use proper password hashing and database lookup
    if (username === 'admin' && password === 'password') {
      const token = jwt.sign(
        { username, role: 'admin' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: { username, role: 'admin' },
        expiresIn: '24h'
      });
    } else {
      res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/public', (req, res) => {
  res.json({
    message: 'Public data accessible to everyone',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Protected routes (authentication required)
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Protected data',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/admin', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  res.json({
    message: 'Admin-only data',
    user: req.user
  });
});

// Semi-protected routes (optional authentication)
app.get('/api/profile', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      message: 'User profile data',
      user: req.user,
      authenticated: true
    });
  } else {
    res.json({
      message: 'Anonymous user data',
      authenticated: false
    });
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(\`Received \${signal}. Shutting down gracefully...\`);

  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`Environment: \${process.env.NODE_ENV || 'development'}\`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;`,
      'middleware/auth.js': `const jwt = require('jsonwebtoken');

// Centralized authentication middleware
const createAuthMiddleware = (options = {}) => {
  const {
    required = true,
    roles = [],
    secret = process.env.JWT_SECRET || 'secret'
  } = options;

  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      if (required) {
        return res.status(401).json({
          error: 'Access token required',
          code: 'TOKEN_MISSING'
        });
      } else {
        return next(); // Optional auth, continue without user
      }
    }

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        if (required) {
          return res.status(403).json({
            error: 'Invalid or expired token',
            code: 'TOKEN_INVALID'
          });
        } else {
          return next(); // Optional auth, continue without user
        }
      }

      // Check role requirements
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: roles
        });
      }

      req.user = user;
      next();
    });
  };
};

// Predefined middleware functions
const requireAuth = createAuthMiddleware({ required: true });
const optionalAuth = createAuthMiddleware({ required: false });
const requireAdmin = createAuthMiddleware({ required: true, roles: ['admin'] });

module.exports = {
  createAuthMiddleware,
  requireAuth,
  optionalAuth,
  requireAdmin
};`
    },
    testCases: [
      'CORS should work for allowed origins',
      'Body parsing should work before authentication',
      'Public routes should not require authentication',
      'Protected routes should require valid tokens'
    ],
    debuggingSteps: [
      'Check middleware order in Express app',
      'Test CORS preflight requests',
      'Verify body parsing with different content types',
      'Test authentication with valid and invalid tokens'
    ],
    commonMistakes: [
      'Applying authentication middleware globally',
      'Wrong order of CORS and body parsing middleware',
      'Rate limiting applied too late',
      'Error handling middleware not placed last'
    ],
    productionImpact: 'CORS failures, authentication bypasses, request parsing errors, security vulnerabilities',
    preventionTips: [
      'Follow Express middleware best practices',
      'Use route-specific middleware when appropriate',
      'Test middleware order with different request types',
      'Document middleware dependencies clearly'
    ]
  },

  // ===== DATABASE & ORM ISSUES (10 challenges) =====

  {
    id: 'node-mongodb-connection-leak',
    title: 'MongoDB Connection Pool Exhaustion',
    description: 'Database connections not being properly closed causing pool exhaustion',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['Node.js', 'MongoDB', 'Connection Pool', 'Memory Leaks', 'Database'],
    rootCause: 'Not properly managing database connections and cursors',
    category: 'Database & ORM',
    files: {
      'user-service.js': `const { MongoClient } = require('mongodb');

class UserService {
  constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
  }

  async getUsers() {
    // BUG: Creating new connection for each request!
    const client = new MongoClient(this.connectionString);

    try {
      await client.connect();
      const db = client.db();
      const users = await db.collection('users').find({}).toArray();

      // BUG: Not closing connection!
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUsersPaginated(page = 1, limit = 10) {
    const client = new MongoClient(this.connectionString);

    try {
      await client.connect();
      const db = client.db();

      // BUG: Not using cursor properly, loading all data into memory!
      const cursor = db.collection('users').find({});
      const users = await cursor.toArray();

      // Manual pagination (inefficient)
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return {
        users: users.slice(startIndex, endIndex),
        total: users.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Error in pagination:', error);
      throw error;
    }
    // BUG: Connection never closed!
  }

  async createUser(userData) {
    const client = new MongoClient(this.connectionString);

    try {
      await client.connect();
      const db = client.db();

      // BUG: No transaction handling for related operations
      const result = await db.collection('users').insertOne(userData);

      // Create user profile
      await db.collection('profiles').insertOne({
        userId: result.insertedId,
        createdAt: new Date()
      });

      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    // BUG: Connection not closed in finally block
  }

  async searchUsers(query) {
    const client = new MongoClient(this.connectionString);

    try {
      await client.connect();
      const db = client.db();

      // BUG: Inefficient regex search without indexing
      const users = await db.collection('users').find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      }).toArray();

      return users;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async updateUserStats() {
    const client = new MongoClient(this.connectionString);

    try {
      await client.connect();
      const db = client.db();

      // BUG: Processing large dataset without streaming
      const users = await db.collection('users').find({}).toArray();

      for (const user of users) {
        // BUG: N+1 query problem!
        const postCount = await db.collection('posts').countDocuments({ userId: user._id });

        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { postCount } }
        );
      }

      console.log(\`Updated stats for \${users.length} users\`);
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  }
}

module.exports = UserService;`
    },
    hints: [
      'Use connection pooling with singleton pattern',
      'Always close connections in finally blocks',
      'Use cursors for large datasets',
      'Implement proper transaction handling'
    ],
    solution: {
      'database.js': `const { MongoClient } = require('mongodb');

class DatabaseManager {
  constructor() {
    this.client = null;
    this.db = null;
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected && this.client) {
      return this.db;
    }

    try {
      // Solution: Single connection with proper pool configuration
      this.client = new MongoClient(this.connectionString, {
        maxPoolSize: 10, // Maximum number of connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false, // Disable mongoose buffering
        useUnifiedTopology: true
      });

      await this.client.connect();
      this.db = this.client.db();
      this.isConnected = true;

      console.log('Connected to MongoDB');

      // Handle connection events
      this.client.on('close', () => {
        console.log('MongoDB connection closed');
        this.isConnected = false;
      });

      this.client.on('error', (error) => {
        console.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      return this.db;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  getDb() {
    if (!this.isConnected || !this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  // Health check method
  async ping() {
    try {
      const db = this.getDb();
      await db.admin().ping();
      return true;
    } catch (error) {
      console.error('Database ping failed:', error);
      return false;
    }
  }
}

// Singleton instance
const dbManager = new DatabaseManager();

module.exports = dbManager;`,
      'user-service.js': `const dbManager = require('./database');
const { ObjectId } = require('mongodb');

class UserService {
  constructor() {
    this.collectionName = 'users';
    this.profilesCollectionName = 'profiles';
  }

  async getUsers() {
    try {
      const db = dbManager.getDb();
      const users = await db.collection(this.collectionName).find({}).toArray();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUsersPaginated(page = 1, limit = 10) {
    try {
      const db = dbManager.getDb();
      const skip = (page - 1) * limit;

      // Solution: Efficient pagination with skip and limit
      const [users, total] = await Promise.all([
        db.collection(this.collectionName)
          .find({})
          .skip(skip)
          .limit(limit)
          .toArray(),
        db.collection(this.collectionName).countDocuments({})
      ]);

      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      };
    } catch (error) {
      console.error('Error in pagination:', error);
      throw error;
    }
  }

  async createUser(userData) {
    const db = dbManager.getDb();
    const session = db.client.startSession();

    try {
      // Solution: Use transactions for related operations
      const result = await session.withTransaction(async () => {
        const userResult = await db.collection(this.collectionName).insertOne(userData, { session });

        // Create user profile
        await db.collection(this.profilesCollectionName).insertOne({
          userId: userResult.insertedId,
          createdAt: new Date(),
          updatedAt: new Date()
        }, { session });

        return userResult;
      });

      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async searchUsers(query, options = {}) {
    try {
      const db = dbManager.getDb();
      const { page = 1, limit = 10, sortBy = 'name', sortOrder = 1 } = options;
      const skip = (page - 1) * limit;

      // Solution: Use text index for efficient search
      const searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      };

      const [users, total] = await Promise.all([
        db.collection(this.collectionName)
          .find(searchQuery)
          .sort({ [sortBy]: sortOrder })
          .skip(skip)
          .limit(limit)
          .toArray(),
        db.collection(this.collectionName).countDocuments(searchQuery)
      ]);

      return {
        users,
        total,
        page,
        limit,
        query
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async updateUserStats() {
    try {
      const db = dbManager.getDb();

      // Solution: Use aggregation pipeline to avoid N+1 queries
      const pipeline = [
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'userId',
            as: 'posts'
          }
        },
        {
          $addFields: {
            postCount: { $size: '$posts' }
          }
        },
        {
          $project: {
            posts: 0 // Remove the posts array from output
          }
        }
      ];

      const cursor = db.collection(this.collectionName).aggregate(pipeline);
      let updatedCount = 0;

      // Solution: Process in batches to avoid memory issues
      const batchSize = 100;
      const batch = [];

      await cursor.forEach(async (user) => {
        batch.push({
          updateOne: {
            filter: { _id: user._id },
            update: { $set: { postCount: user.postCount, updatedAt: new Date() } }
          }
        });

        if (batch.length >= batchSize) {
          await db.collection(this.collectionName).bulkWrite(batch);
          updatedCount += batch.length;
          batch.length = 0; // Clear batch
          console.log(\`Updated \${updatedCount} users so far...\`);
        }
      });

      // Process remaining items in batch
      if (batch.length > 0) {
        await db.collection(this.collectionName).bulkWrite(batch);
        updatedCount += batch.length;
      }

      console.log(\`Updated stats for \${updatedCount} users\`);
      return updatedCount;
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  }

  // Solution: Streaming large datasets
  async streamUsers(callback) {
    try {
      const db = dbManager.getDb();
      const cursor = db.collection(this.collectionName).find({});

      let processedCount = 0;

      await cursor.forEach(async (user) => {
        try {
          await callback(user);
          processedCount++;

          if (processedCount % 1000 === 0) {
            console.log(\`Processed \${processedCount} users\`);
          }
        } catch (error) {
          console.error(\`Error processing user \${user._id}:\`, error);
        }
      });

      return processedCount;
    } catch (error) {
      console.error('Error streaming users:', error);
      throw error;
    }
  }

  // Cleanup method for graceful shutdown
  async cleanup() {
    console.log('Cleaning up UserService...');
    // Any cleanup logic here
  }
}

module.exports = UserService;`,
      'app.js': `const express = require('express');
const dbManager = require('./database');
const UserService = require('./user-service');

const app = express();
app.use(express.json());

const userService = new UserService();

// Initialize database connection
async function initializeApp() {
  try {
    await dbManager.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

// Routes
app.get('/api/users', async (req, res) => {
  try {
    const { page, limit } = req.query;

    if (page || limit) {
      const result = await userService.getUsersPaginated(
        parseInt(page) || 1,
        parseInt(limit) || 10
      );
      res.json(result);
    } else {
      const users = await userService.getUsers();
      res.json({ users });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/search', async (req, res) => {
  try {
    const { q, page, limit, sortBy, sortOrder } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const result = await userService.searchUsers(q, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortBy: sortBy || 'name',
      sortOrder: parseInt(sortOrder) || 1
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/update-stats', async (req, res) => {
  try {
    const updatedCount = await userService.updateUserStats();
    res.json({ message: \`Updated \${updatedCount} users\` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const dbHealthy = await dbManager.ping();
    res.json({
      status: 'healthy',
      database: dbHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(\`Received \${signal}. Starting graceful shutdown...\`);

  try {
    await userService.cleanup();
    await dbManager.disconnect();
    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Initialize and start server
initializeApp().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
  });
});

module.exports = app;`
    },
    testCases: [
      'Connection pool should not be exhausted under load',
      'Large datasets should be processed without memory issues',
      'Transactions should work correctly for related operations',
      'Graceful shutdown should close all connections'
    ],
    debuggingSteps: [
      'Monitor connection pool metrics',
      'Check memory usage during large operations',
      'Test transaction rollback scenarios',
      'Verify proper connection cleanup'
    ],
    commonMistakes: [
      'Creating new connections for each request',
      'Not closing connections properly',
      'Loading large datasets into memory',
      'Not using transactions for related operations'
    ],
    productionImpact: 'Connection pool exhaustion, memory leaks, data inconsistency, application crashes',
    preventionTips: [
      'Use connection pooling with singleton pattern',
      'Always close connections in finally blocks',
      'Use streaming for large datasets',
      'Implement proper transaction handling'
    ]
  },

  // ===== SECURITY ISSUES (8 challenges) =====

  {
    id: 'node-sql-injection-vulnerability',
    title: 'SQL Injection Vulnerability',
    description: 'Database queries vulnerable to SQL injection attacks',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '22 min',
    xpReward: 170,
    tags: ['Node.js', 'Security', 'SQL Injection', 'Database', 'Vulnerability'],
    rootCause: 'Using string concatenation for SQL queries instead of parameterized queries',
    category: 'Security',
    files: {
      'user-controller.js': `const mysql = require('mysql2');
const express = require('express');

const router = express.Router();

// BUG: Insecure database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // BUG: Empty password!
  database: 'myapp'
});

// BUG: SQL Injection vulnerability!
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  // BUG: Direct string concatenation - vulnerable to SQL injection!
  const query = \`SELECT * FROM users WHERE id = \${userId}\`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// BUG: Another SQL injection vulnerability
router.get('/users/search', (req, res) => {
  const { name, email } = req.query;

  // BUG: Building query with user input directly!
  let query = 'SELECT * FROM users WHERE 1=1';

  if (name) {
    query += \` AND name LIKE '%\${name}%'\`;
  }

  if (email) {
    query += \` AND email = '\${email}'\`;
  }

  console.log('Executing query:', query); // BUG: Logging sensitive queries!

  db.query(query, (error, results) => {
    if (error) {
      console.error('Search error:', error);
      return res.status(500).json({ error: 'Search failed' });
    }

    res.json(results);
  });
});

// BUG: Login vulnerable to SQL injection
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // BUG: Direct string interpolation in authentication query!
  const query = \`
    SELECT id, username, role
    FROM users
    WHERE username = '\${username}' AND password = '\${password}'
  \`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (results.length > 0) {
      // BUG: No password hashing verification!
      res.json({
        success: true,
        user: results[0],
        // BUG: Exposing sensitive information
        query: query
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// BUG: Update operation vulnerable to SQL injection
router.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;

  // BUG: Dynamic query building without parameterization
  const updates = [];
  if (name) updates.push(\`name = '\${name}'\`);
  if (email) updates.push(\`email = '\${email}'\`);
  if (role) updates.push(\`role = '\${role}'\`);

  const query = \`UPDATE users SET \${updates.join(', ')} WHERE id = \${userId}\`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Update failed' });
    }

    res.json({ success: true, affectedRows: results.affectedRows });
  });
});

module.exports = router;`
    },
    hints: [
      'Use parameterized queries with placeholders',
      'Validate and sanitize all user inputs',
      'Use prepared statements for database operations',
      'Implement proper password hashing and verification'
    ],
    solution: {
      'database.js': `const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

class DatabaseManager {
  constructor() {
    this.pool = null;
    this.initializePool();
  }

  initializePool() {
    // Solution: Secure database configuration
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'app_user',
      password: process.env.DB_PASSWORD, // Solution: Use environment variables
      database: process.env.DB_NAME || 'myapp',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Security configurations
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true
      } : false,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true
    });
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async query(sql, params = []) {
    const connection = await this.getConnection();
    try {
      const [results] = await connection.execute(sql, params);
      return results;
    } finally {
      connection.release();
    }
  }

  async transaction(callback) {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

module.exports = new DatabaseManager();`,
      'user-controller.js': `const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');
const db = require('./database');

const router = express.Router();

// Rate limiting for sensitive endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
const validateUserId = [
  param('id').isInt({ min: 1 }).withMessage('User ID must be a positive integer')
];

const validateUserSearch = [
  query('name').optional().isLength({ min: 1, max: 100 }).trim().escape(),
  query('email').optional().isEmail().normalizeEmail()
];

const validateLogin = [
  body('username').isLength({ min: 3, max: 50 }).trim().escape(),
  body('password').isLength({ min: 6, max: 100 })
];

const validateUserUpdate = [
  param('id').isInt({ min: 1 }),
  body('name').optional().isLength({ min: 1, max: 100 }).trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['user', 'admin', 'moderator'])
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Solution: Secure user retrieval with parameterized query
router.get('/users/:id', validateUserId, handleValidationErrors, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Solution: Parameterized query prevents SQL injection
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
    const results = await db.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Solution: Secure search with parameterized queries
router.get('/users/search', validateUserSearch, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, username, email, role, created_at FROM users WHERE 1=1';
    const params = [];

    if (name) {
      query += ' AND name LIKE ?';
      params.push(\`%\${name}%\`);
    }

    if (email) {
      query += ' AND email = ?';
      params.push(email);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const results = await db.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];

    if (name) {
      countQuery += ' AND name LIKE ?';
      countParams.push(\`%\${name}%\`);
    }

    if (email) {
      countQuery += ' AND email = ?';
      countParams.push(email);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      users: results,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Solution: Secure login with proper password hashing
router.post('/login', loginLimiter, validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Solution: Parameterized query for authentication
    const query = 'SELECT id, username, password_hash, role FROM users WHERE username = ?';
    const results = await db.query(query, [username]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    // Solution: Proper password verification with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Solution: Don't expose sensitive information
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Solution: Secure user update with parameterized queries
router.put('/users/:id', validateUserUpdate, handleValidationErrors, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { name, email, role } = req.body;

    // Check if user exists first
    const existingUser = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build update query dynamically but safely
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }

    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }

    if (role !== undefined) {
      updates.push('role = ?');
      params.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('updated_at = NOW()');
    params.push(userId);

    const query = \`UPDATE users SET \${updates.join(', ')} WHERE id = ?\`;

    const result = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return updated user data
    const updatedUser = await db.query(
      'SELECT id, username, email, role, updated_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Update error:', error.message);

    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Update failed' });
  }
});

// Solution: Secure user creation
router.post('/users', [
  body('username').isLength({ min: 3, max: 50 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8, max: 100 }),
  body('role').optional().isIn(['user', 'admin', 'moderator'])
], handleValidationErrors, async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = \`
      INSERT INTO users (username, email, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, NOW())
    \`;

    const result = await db.query(query, [username, email, passwordHash, role]);

    res.status(201).json({
      success: true,
      userId: result.insertId,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('User creation error:', error.message);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    res.status(500).json({ error: 'User creation failed' });
  }
});

module.exports = router;`
    },
    testCases: [
      'SQL injection attempts should be blocked',
      'Parameterized queries should work correctly',
      'Password hashing should be secure',
      'Input validation should prevent malicious data'
    ],
    debuggingSteps: [
      'Test with SQL injection payloads',
      'Verify parameterized query execution',
      'Check password hashing implementation',
      'Validate input sanitization'
    ],
    commonMistakes: [
      'Using string concatenation for SQL queries',
      'Not validating and sanitizing user inputs',
      'Storing passwords in plain text',
      'Exposing sensitive information in responses'
    ],
    productionImpact: 'Data breaches, unauthorized access, data corruption, compliance violations',
    preventionTips: [
      'Always use parameterized queries',
      'Implement comprehensive input validation',
      'Use proper password hashing (bcrypt)',
      'Follow security best practices and regular audits'
    ]
  },

  // ===== PERFORMANCE & OPTIMIZATION ISSUES (8 challenges) =====

  {
    id: 'node-cpu-intensive-blocking',
    title: 'CPU-Intensive Operations Blocking Event Loop',
    description: 'Synchronous CPU-intensive operations blocking the event loop',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 160,
    tags: ['Node.js', 'Performance', 'Event Loop', 'CPU', 'Optimization'],
    rootCause: 'Running CPU-intensive operations on the main thread without proper async handling',
    category: 'Performance & Optimization',
    files: {
      'data-processor.js': `const express = require('express');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// BUG: CPU-intensive operation blocking event loop!
function processLargeDataset(data) {
  console.log('Starting data processing...');

  // BUG: Synchronous operation that takes a long time!
  const results = [];
  for (let i = 0; i < data.length; i++) {
    // Simulate complex calculation
    let hash = crypto.createHash('sha256');

    // BUG: Nested loops creating O(n²) complexity!
    for (let j = 0; j < 1000; j++) {
      hash.update(data[i] + j.toString());
    }

    const result = hash.digest('hex');

    // BUG: More synchronous processing!
    const processed = {
      original: data[i],
      hash: result,
      timestamp: Date.now(),
      // BUG: Expensive JSON operations in loop!
      metadata: JSON.parse(JSON.stringify({
        index: i,
        complexity: Math.pow(i, 2),
        factors: findFactors(i + 1) // BUG: Another expensive operation!
      }))
    };

    results.push(processed);

    // BUG: No yielding to event loop!
    if (i % 100 === 0) {
      console.log(\`Processed \${i} items...\`);
    }
  }

  console.log('Data processing completed');
  return results;
}

// BUG: Inefficient algorithm
function findFactors(n) {
  const factors = [];
  // BUG: Brute force approach without optimization!
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

// BUG: Synchronous file operations
function loadConfigSync() {
  console.log('Loading configuration...');

  // BUG: Blocking file read!
  const config = fs.readFileSync('./config.json', 'utf8');
  const parsed = JSON.parse(config);

  // BUG: More blocking operations!
  const secrets = fs.readFileSync('./secrets.json', 'utf8');
  parsed.secrets = JSON.parse(secrets);

  // BUG: Synchronous validation
  validateConfig(parsed);

  return parsed;
}

function validateConfig(config) {
  // BUG: Expensive validation without yielding
  const requiredFields = ['database', 'redis', 'auth', 'logging'];

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(\`Missing required field: \${field}\`);
    }

    // BUG: Nested validation loops
    if (typeof config[field] === 'object') {
      for (const key in config[field]) {
        // Simulate expensive validation
        for (let i = 0; i < 1000; i++) {
          const hash = crypto.createHash('md5').update(key + i).digest('hex');
        }
      }
    }
  }
}

// API endpoints
app.post('/process-data', (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Data must be an array' });
    }

    console.log(\`Processing \${data.length} items...\`);

    // BUG: This will block the entire server!
    const results = processLargeDataset(data);

    res.json({
      success: true,
      processed: results.length,
      results: results
    });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

app.get('/config', (req, res) => {
  try {
    // BUG: Blocking the event loop on every request!
    const config = loadConfigSync();
    res.json(config);
  } catch (error) {
    console.error('Config error:', error);
    res.status(500).json({ error: 'Failed to load config' });
  }
});

// BUG: Health check that can be blocked by other operations
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);

  // BUG: Loading config synchronously on startup!
  try {
    const config = loadConfigSync();
    console.log('Configuration loaded successfully');
  } catch (error) {
    console.error('Failed to load configuration:', error);
  }
});`
    },
    hints: [
      'Use worker threads for CPU-intensive operations',
      'Implement async/await for file operations',
      'Use setImmediate() to yield control to event loop',
      'Optimize algorithms to reduce computational complexity'
    ],
    solution: {
      'data-processor.js': `const express = require('express');
const fs = require('fs').promises;
const crypto = require('crypto');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');

const app = express();
app.use(express.json());

// Solution: Worker thread for CPU-intensive operations
class DataProcessor {
  constructor() {
    this.configCache = null;
    this.configCacheTime = 0;
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  }

  async processLargeDataset(data, options = {}) {
    const { batchSize = 100, useWorker = true } = options;

    if (useWorker && data.length > 500) {
      return this.processWithWorker(data, batchSize);
    } else {
      return this.processWithBatching(data, batchSize);
    }
  }

  async processWithWorker(data, batchSize) {
    return new Promise((resolve, reject) => {
      const workerPath = path.join(__dirname, 'data-processor-worker.js');
      const worker = new Worker(workerPath, {
        workerData: { data, batchSize }
      });

      const timeout = setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker timeout'));
      }, 30000); // 30 second timeout

      worker.on('message', (result) => {
        clearTimeout(timeout);
        resolve(result);
      });

      worker.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      worker.on('exit', (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          reject(new Error(\`Worker stopped with exit code \${code}\`));
        }
      });
    });
  }

  async processWithBatching(data, batchSize) {
    const results = [];
    const totalBatches = Math.ceil(data.length / batchSize);

    console.log(\`Processing \${data.length} items in \${totalBatches} batches...\`);

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = await this.processBatch(batch, i);
      results.push(...batchResults);

      // Solution: Yield control to event loop between batches
      await new Promise(resolve => setImmediate(resolve));

      const batchNumber = Math.floor(i / batchSize) + 1;
      console.log(\`Completed batch \${batchNumber}/\${totalBatches}\`);
    }

    return results;
  }

  async processBatch(batch, startIndex) {
    const results = [];

    for (let i = 0; i < batch.length; i++) {
      const item = batch[i];
      const globalIndex = startIndex + i;

      // Solution: Optimized processing
      const result = await this.processItem(item, globalIndex);
      results.push(result);

      // Solution: Yield periodically within batch
      if (i % 10 === 0 && i > 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
    }

    return results;
  }

  async processItem(item, index) {
    // Solution: Use crypto.createHash more efficiently
    const hash = crypto.createHash('sha256');

    // Solution: Reduced complexity - single hash operation
    hash.update(item + index.toString());
    const result = hash.digest('hex');

    return {
      original: item,
      hash: result,
      timestamp: Date.now(),
      metadata: {
        index,
        complexity: index * 2, // Solution: Simplified calculation
        factors: await this.findFactorsOptimized(index + 1)
      }
    };
  }

  async findFactorsOptimized(n) {
    if (n <= 1) return [1];

    const factors = [1];
    const sqrt = Math.sqrt(n);

    // Solution: Optimized algorithm - only check up to sqrt(n)
    for (let i = 2; i <= sqrt; i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) {
          factors.push(n / i);
        }
      }

      // Yield control for large numbers
      if (i % 100 === 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
    }

    if (n > 1) factors.push(n);
    return factors.sort((a, b) => a - b);
  }

  async loadConfig() {
    // Solution: Implement caching to avoid repeated file reads
    const now = Date.now();
    if (this.configCache && (now - this.configCacheTime) < this.CACHE_TTL) {
      return this.configCache;
    }

    try {
      console.log('Loading configuration...');

      // Solution: Async file operations
      const [configData, secretsData] = await Promise.all([
        fs.readFile('./config.json', 'utf8').catch(() => '{}'),
        fs.readFile('./secrets.json', 'utf8').catch(() => '{}')
      ]);

      const config = JSON.parse(configData);
      const secrets = JSON.parse(secretsData);

      config.secrets = secrets;

      // Solution: Async validation
      await this.validateConfigAsync(config);

      // Update cache
      this.configCache = config;
      this.configCacheTime = now;

      return config;
    } catch (error) {
      console.error('Config loading error:', error);
      throw error;
    }
  }

  async validateConfigAsync(config) {
    const requiredFields = ['database', 'redis', 'auth', 'logging'];

    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(\`Missing required field: \${field}\`);
      }

      // Solution: Simplified validation without expensive operations
      if (typeof config[field] === 'object') {
        const keys = Object.keys(config[field]);
        if (keys.length === 0) {
          throw new Error(\`Empty configuration for \${field}\`);
        }
      }

      // Solution: Yield control during validation
      await new Promise(resolve => setImmediate(resolve));
    }
  }

  clearCache() {
    this.configCache = null;
    this.configCacheTime = 0;
  }
}

// Create processor instance
const processor = new DataProcessor();

// API endpoints with proper async handling
app.post('/process-data', async (req, res) => {
  try {
    const { data, options = {} } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Data must be an array' });
    }

    if (data.length > 10000) {
      return res.status(400).json({
        error: 'Dataset too large. Maximum 10,000 items allowed.'
      });
    }

    console.log(\`Processing \${data.length} items...\`);
    const startTime = Date.now();

    // Solution: Non-blocking processing
    const results = await processor.processLargeDataset(data, options);

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      processed: results.length,
      processingTime,
      results: results
    });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({
      error: 'Processing failed',
      message: error.message
    });
  }
});

app.get('/config', async (req, res) => {
  try {
    // Solution: Non-blocking config loading
    const config = await processor.loadConfig();

    // Remove sensitive information
    const safeConfig = { ...config };
    delete safeConfig.secrets;

    res.json(safeConfig);
  } catch (error) {
    console.error('Config error:', error);
    res.status(500).json({ error: 'Failed to load config' });
  }
});

app.post('/config/reload', async (req, res) => {
  try {
    processor.clearCache();
    const config = await processor.loadConfig();
    res.json({ success: true, message: 'Configuration reloaded' });
  } catch (error) {
    console.error('Config reload error:', error);
    res.status(500).json({ error: 'Failed to reload config' });
  }
});

// Solution: Health check that's always responsive
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

// Performance monitoring endpoint
app.get('/metrics', (req, res) => {
  const usage = process.cpuUsage();
  const memory = process.memoryUsage();

  res.json({
    cpu: {
      user: usage.user,
      system: usage.system
    },
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external
    },
    uptime: process.uptime(),
    eventLoopDelay: process.hrtime()
  });
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Solution: Load config asynchronously on startup
    await processor.loadConfig();
    console.log('Configuration loaded successfully');

    app.listen(PORT, () => {
      console.log(\`Server running on port \${PORT}\`);
      console.log(\`Process ID: \${process.pid}\`);
      console.log(\`Node.js version: \${process.version}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();`,
      'data-processor-worker.js': `const { parentPort, workerData } = require('worker_threads');
const crypto = require('crypto');

async function processInWorker() {
  try {
    const { data, batchSize } = workerData;
    const results = [];

    console.log(\`Worker processing \${data.length} items...\`);

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      for (let j = 0; j < batch.length; j++) {
        const item = batch[j];
        const globalIndex = i + j;

        // Optimized processing in worker
        const hash = crypto.createHash('sha256');
        hash.update(item + globalIndex.toString());
        const result = hash.digest('hex');

        results.push({
          original: item,
          hash: result,
          timestamp: Date.now(),
          metadata: {
            index: globalIndex,
            complexity: globalIndex * 2,
            factors: findFactorsOptimized(globalIndex + 1)
          }
        });
      }

      // Report progress
      if (i % (batchSize * 10) === 0) {
        console.log(\`Worker processed \${i + batch.length} items...\`);
      }
    }

    parentPort.postMessage(results);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
}

function findFactorsOptimized(n) {
  if (n <= 1) return [1];

  const factors = [1];
  const sqrt = Math.sqrt(n);

  for (let i = 2; i <= sqrt; i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) {
        factors.push(n / i);
      }
    }
  }

  if (n > 1) factors.push(n);
  return factors.sort((a, b) => a - b);
}

processInWorker();`
    },
    testCases: [
      'Large dataset processing should not block other requests',
      'Health check should always respond quickly',
      'Worker threads should handle CPU-intensive operations',
      'Event loop should remain responsive during processing'
    ],
    debuggingSteps: [
      'Monitor event loop delay during processing',
      'Test concurrent requests while processing',
      'Check CPU usage and memory consumption',
      'Verify worker thread functionality'
    ],
    commonMistakes: [
      'Running CPU-intensive operations on main thread',
      'Not yielding control to event loop',
      'Using synchronous file operations',
      'Implementing inefficient algorithms without optimization'
    ],
    productionImpact: 'Server unresponsiveness, request timeouts, poor user experience, system crashes',
    preventionTips: [
      'Use worker threads for CPU-intensive operations',
      'Implement batching with setImmediate() for yielding',
      'Use async/await for all I/O operations',
      'Optimize algorithms and implement caching where appropriate'
    ]
  },

  // ===== TESTING & MOCKING ISSUES (6 challenges) =====

  {
    id: 'node-testing-async-mocking',
    title: 'Async Testing and Mocking Issues',
    description: 'Problems with testing async operations and mocking dependencies',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '22 min',
    xpReward: 150,
    tags: ['Node.js', 'Testing', 'Mocking', 'Jest', 'Async'],
    rootCause: 'Improper async testing patterns and inadequate mocking strategies',
    category: 'Testing & Mocking',
    files: {
      'user-service.js': `const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user-model');
const EmailService = require('./email-service');
const AuditLogger = require('./audit-logger');

class UserService {
  constructor() {
    this.emailService = new EmailService();
    this.auditLogger = new AuditLogger();
  }

  async createUser(userData) {
    try {
      // Validate user data
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        isActive: true
      });

      // Send welcome email (async operation)
      await this.emailService.sendWelcomeEmail(user.email, user.name);

      // Log user creation
      await this.auditLogger.log('USER_CREATED', {
        userId: user.id,
        email: user.email,
        timestamp: new Date()
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      // Log successful login
      await this.auditLogger.log('USER_LOGIN', {
        userId: user.id,
        email: user.email,
        timestamp: new Date()
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // If password is being updated, hash it
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const updatedUser = await User.update(userId, {
        ...updates,
        updatedAt: new Date()
      });

      // Send profile update notification
      if (updates.email && updates.email !== user.email) {
        await this.emailService.sendEmailChangeNotification(
          user.email,
          updates.email
        );
      }

      // Log profile update
      await this.auditLogger.log('USER_UPDATED', {
        userId,
        changes: Object.keys(updates),
        timestamp: new Date()
      });

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Soft delete - mark as inactive
      await User.update(userId, {
        isActive: false,
        deletedAt: new Date()
      });

      // Send account deletion confirmation
      await this.emailService.sendAccountDeletionConfirmation(user.email);

      // Log user deletion
      await this.auditLogger.log('USER_DELETED', {
        userId,
        email: user.email,
        timestamp: new Date()
      });

      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = UserService;`,
      'user-service.test.js': `const UserService = require('./user-service');
const User = require('./user-model');
const EmailService = require('./email-service');
const AuditLogger = require('./audit-logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// BUG: Not mocking dependencies properly!
describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  // BUG: Not testing async operations properly!
  describe('createUser', () => {
    it('should create a new user', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      // BUG: Not mocking User.findByEmail!
      // BUG: Not handling async operation!
      const result = userService.createUser(userData);

      // BUG: This will fail because result is a Promise!
      expect(result.email).toBe(userData.email);
    });

    // BUG: Not testing error scenarios!
    it('should handle duplicate email', () => {
      const userData = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123'
      };

      // BUG: Not mocking the existing user scenario!
      userService.createUser(userData);

      // BUG: Not expecting the error properly!
      expect(() => {
        userService.createUser(userData);
      }).toThrow('User already exists');
    });
  });

  describe('authenticateUser', () => {
    // BUG: Not mocking bcrypt.compare!
    it('should authenticate valid user', () => {
      const email = 'test@example.com';
      const password = 'password123';

      // BUG: Not setting up proper mocks!
      const result = userService.authenticateUser(email, password);

      // BUG: Not handling Promise!
      expect(result.token).toBeDefined();
    });

    // BUG: Not testing inactive user scenario!
    it('should reject inactive user', () => {
      const email = 'inactive@example.com';
      const password = 'password123';

      // BUG: No mock setup for inactive user!
      userService.authenticateUser(email, password);
    });
  });

  // BUG: Not testing all methods!
  // Missing tests for updateUserProfile and deleteUser
});`
    },
    hints: [
      'Use jest.mock() to mock dependencies',
      'Use async/await in test functions',
      'Mock all external dependencies and modules',
      'Test both success and error scenarios'
    ],
    solution: {
      'user-service.test.js': `const UserService = require('./user-service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Solution: Mock all dependencies
jest.mock('./user-model');
jest.mock('./email-service');
jest.mock('./audit-logger');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const User = require('./user-model');
const EmailService = require('./email-service');
const AuditLogger = require('./audit-logger');

describe('UserService', () => {
  let userService;
  let mockEmailService;
  let mockAuditLogger;

  beforeEach(() => {
    // Solution: Reset all mocks before each test
    jest.clearAllMocks();

    // Solution: Create mock instances
    mockEmailService = {
      sendWelcomeEmail: jest.fn(),
      sendEmailChangeNotification: jest.fn(),
      sendAccountDeletionConfirmation: jest.fn()
    };

    mockAuditLogger = {
      log: jest.fn()
    };

    // Solution: Mock constructors
    EmailService.mockImplementation(() => mockEmailService);
    AuditLogger.mockImplementation(() => mockAuditLogger);

    userService = new UserService();
  });

  describe('createUser', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    // Solution: Proper async testing
    it('should create a new user successfully', async () => {
      // Solution: Mock all dependencies
      User.findByEmail.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      User.create.mockResolvedValue({
        id: 1,
        ...userData,
        password: 'hashedPassword123',
        createdAt: new Date(),
        isActive: true
      });
      mockEmailService.sendWelcomeEmail.mockResolvedValue();
      mockAuditLogger.log.mockResolvedValue();

      // Solution: Use await for async operation
      const result = await userService.createUser(userData);

      // Solution: Verify the result
      expect(result).toEqual({
        id: 1,
        name: userData.name,
        email: userData.email,
        createdAt: expect.any(Date),
        isActive: true
      });

      // Solution: Verify all mocks were called correctly
      expect(User.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedPassword123',
        createdAt: expect.any(Date),
        isActive: true
      });
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        userData.email,
        userData.name
      );
      expect(mockAuditLogger.log).toHaveBeenCalledWith('USER_CREATED', {
        userId: 1,
        email: userData.email,
        timestamp: expect.any(Date)
      });
    });

    // Solution: Test error scenarios
    it('should throw error for duplicate email', async () => {
      // Solution: Mock existing user
      User.findByEmail.mockResolvedValue({
        id: 1,
        email: userData.email
      });

      // Solution: Use rejects matcher for async errors
      await expect(userService.createUser(userData))
        .rejects
        .toThrow('User already exists');

      // Solution: Verify no user creation attempted
      expect(User.create).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should throw error for missing required fields', async () => {
      const invalidUserData = { name: 'John Doe' }; // Missing email and password

      await expect(userService.createUser(invalidUserData))
        .rejects
        .toThrow('Email and password are required');

      expect(User.findByEmail).not.toHaveBeenCalled();
    });

    // Solution: Test email service failure
    it('should handle email service failure gracefully', async () => {
      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      User.create.mockResolvedValue({
        id: 1,
        ...userData,
        password: 'hashedPassword123'
      });

      // Solution: Mock email service failure
      mockEmailService.sendWelcomeEmail.mockRejectedValue(
        new Error('Email service unavailable')
      );

      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Email service unavailable');
    });
  });

  describe('authenticateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockUser = {
      id: 1,
      email,
      name: 'Test User',
      password: 'hashedPassword123',
      isActive: true
    };

    it('should authenticate valid user', async () => {
      // Solution: Mock all dependencies
      User.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-jwt-token');
      mockAuditLogger.log.mockResolvedValue();

      const result = await userService.authenticateUser(email, password);

      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name
        }
      });

      expect(User.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, email: mockUser.email },
        expect.any(String),
        { expiresIn: '24h' }
      );
      expect(mockAuditLogger.log).toHaveBeenCalledWith('USER_LOGIN', {
        userId: mockUser.id,
        email: mockUser.email,
        timestamp: expect.any(Date)
      });
    });

    it('should reject invalid email', async () => {
      User.findByEmail.mockResolvedValue(null);

      await expect(userService.authenticateUser(email, password))
        .rejects
        .toThrow('Invalid credentials');

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should reject invalid password', async () => {
      User.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.authenticateUser(email, password))
        .rejects
        .toThrow('Invalid credentials');

      expect(jwt.sign).not.toHaveBeenCalled();
    });

    // Solution: Test inactive user scenario
    it('should reject inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      User.findByEmail.mockResolvedValue(inactiveUser);

      await expect(userService.authenticateUser(email, password))
        .rejects
        .toThrow('Account is deactivated');

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('updateUserProfile', () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      email: 'old@example.com',
      name: 'Old Name',
      isActive: true
    };

    it('should update user profile successfully', async () => {
      const updates = {
        name: 'New Name',
        email: 'new@example.com'
      };

      User.findById.mockResolvedValue(mockUser);
      User.update.mockResolvedValue({
        ...mockUser,
        ...updates,
        updatedAt: new Date()
      });
      mockEmailService.sendEmailChangeNotification.mockResolvedValue();
      mockAuditLogger.log.mockResolvedValue();

      const result = await userService.updateUserProfile(userId, updates);

      expect(result).toEqual({
        id: userId,
        email: updates.email,
        name: updates.name,
        isActive: true,
        updatedAt: expect.any(Date)
      });

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(User.update).toHaveBeenCalledWith(userId, {
        ...updates,
        updatedAt: expect.any(Date)
      });
      expect(mockEmailService.sendEmailChangeNotification).toHaveBeenCalledWith(
        mockUser.email,
        updates.email
      );
    });

    it('should hash password when updating', async () => {
      const updates = { password: 'newPassword123' };

      User.findById.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('newHashedPassword');
      User.update.mockResolvedValue({
        ...mockUser,
        password: 'newHashedPassword',
        updatedAt: new Date()
      });
      mockAuditLogger.log.mockResolvedValue();

      await userService.updateUserProfile(userId, updates);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(User.update).toHaveBeenCalledWith(userId, {
        password: 'newHashedPassword',
        updatedAt: expect.any(Date)
      });
    });

    it('should throw error for non-existent user', async () => {
      User.findById.mockResolvedValue(null);

      await expect(userService.updateUserProfile(userId, { name: 'New Name' }))
        .rejects
        .toThrow('User not found');

      expect(User.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      email: 'test@example.com',
      name: 'Test User',
      isActive: true
    };

    it('should delete user successfully', async () => {
      User.findById.mockResolvedValue(mockUser);
      User.update.mockResolvedValue();
      mockEmailService.sendAccountDeletionConfirmation.mockResolvedValue();
      mockAuditLogger.log.mockResolvedValue();

      const result = await userService.deleteUser(userId);

      expect(result).toEqual({
        success: true,
        message: 'User deleted successfully'
      });

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(User.update).toHaveBeenCalledWith(userId, {
        isActive: false,
        deletedAt: expect.any(Date)
      });
      expect(mockEmailService.sendAccountDeletionConfirmation)
        .toHaveBeenCalledWith(mockUser.email);
      expect(mockAuditLogger.log).toHaveBeenCalledWith('USER_DELETED', {
        userId,
        email: mockUser.email,
        timestamp: expect.any(Date)
      });
    });

    it('should throw error for non-existent user', async () => {
      User.findById.mockResolvedValue(null);

      await expect(userService.deleteUser(userId))
        .rejects
        .toThrow('User not found');

      expect(User.update).not.toHaveBeenCalled();
      expect(mockEmailService.sendAccountDeletionConfirmation).not.toHaveBeenCalled();
    });
  });

  // Solution: Test edge cases and error handling
  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      User.findByEmail.mockRejectedValue(new Error('Database connection failed'));

      await expect(userService.createUser({
        name: 'Test',
        email: 'test@example.com',
        password: 'password'
      })).rejects.toThrow('Database connection failed');
    });

    it('should handle bcrypt errors', async () => {
      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error('Bcrypt error'));

      await expect(userService.createUser({
        name: 'Test',
        email: 'test@example.com',
        password: 'password'
      })).rejects.toThrow('Bcrypt error');
    });
  });
});`,
      'jest.config.js': `module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/config/**',
    '!src/migrations/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  testTimeout: 10000
};`,
      'test-setup.js': `// Global test setup
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

// Global test utilities
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    isActive: true,
    createdAt: new Date(),
    ...overrides
  }),

  createMockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides
  }),

  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  }
};`
    },
    testCases: [
      'All async operations should be properly tested',
      'Dependencies should be mocked correctly',
      'Both success and error scenarios should be covered',
      'Mock functions should be verified for correct calls'
    ],
    debuggingSteps: [
      'Use jest.clearAllMocks() in beforeEach',
      'Mock all external dependencies',
      'Use async/await in test functions',
      'Verify mock function calls with expect().toHaveBeenCalledWith()'
    ],
    commonMistakes: [
      'Not mocking external dependencies',
      'Not handling async operations in tests',
      'Not testing error scenarios',
      'Not verifying mock function calls'
    ],
    productionImpact: 'Unreliable tests, missed bugs, false confidence in code quality, deployment failures',
    preventionTips: [
      'Always mock external dependencies',
      'Use proper async testing patterns',
      'Test both success and error paths',
      'Verify all mock interactions'
    ]
  },

  // ===== WEBSOCKET & REAL-TIME ISSUES (5 challenges) =====

  {
    id: 'node-websocket-connection-management',
    title: 'WebSocket Connection Management Issues',
    description: 'Problems with WebSocket connection handling and cleanup',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['Node.js', 'WebSocket', 'Real-time', 'Connection Management'],
    rootCause: 'Improper WebSocket connection lifecycle management and error handling',
    category: 'WebSocket & Real-time',
    files: {
      'websocket-server.js': `const WebSocket = require('ws');
const http = require('http');
const url = require('url');

class WebSocketServer {
  constructor(port = 8080) {
    this.port = port;
    this.server = http.createServer();
    this.wss = new WebSocket.Server({ server: this.server });
    this.clients = new Map(); // BUG: Not cleaning up disconnected clients!
    this.rooms = new Map();

    this.setupWebSocketHandlers();
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, request) => {
      console.log('New WebSocket connection');

      // BUG: Not parsing connection parameters properly!
      const query = url.parse(request.url, true).query;
      const userId = query.userId;
      const roomId = query.roomId;

      // BUG: Not validating user/room parameters!
      this.clients.set(ws, { userId, roomId, lastSeen: Date.now() });

      // BUG: Not handling room joining properly!
      if (roomId) {
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(ws);
      }

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (error) {
          // BUG: Not handling JSON parse errors properly!
          console.error('Invalid JSON:', error);
        }
      });

      ws.on('close', (code, reason) => {
        console.log('WebSocket connection closed:', code, reason);
        // BUG: Not cleaning up client data properly!
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        // BUG: Not handling errors properly!
      });

      // BUG: Not implementing ping/pong for connection health!
    });
  }

  handleMessage(ws, message) {
    const clientInfo = this.clients.get(ws);

    switch (message.type) {
      case 'chat':
        // BUG: Not validating message content!
        this.broadcastToRoom(clientInfo.roomId, {
          type: 'chat',
          userId: clientInfo.userId,
          message: message.content,
          timestamp: Date.now()
        });
        break;

      case 'join_room':
        // BUG: Not handling room changes properly!
        this.joinRoom(ws, message.roomId);
        break;

      case 'leave_room':
        this.leaveRoom(ws, message.roomId);
        break;

      default:
        // BUG: Not handling unknown message types!
        console.log('Unknown message type:', message.type);
    }
  }

  joinRoom(ws, roomId) {
    const clientInfo = this.clients.get(ws);

    // BUG: Not leaving previous room!
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId).add(ws);
    clientInfo.roomId = roomId;

    // BUG: Not notifying other room members!
  }

  leaveRoom(ws, roomId) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(ws);

      // BUG: Not cleaning up empty rooms!
      if (this.rooms.get(roomId).size === 0) {
        // Should delete empty room
      }
    }
  }

  broadcastToRoom(roomId, message) {
    if (!this.rooms.has(roomId)) return;

    const clients = this.rooms.get(roomId);
    const messageStr = JSON.stringify(message);

    clients.forEach(client => {
      // BUG: Not checking if client is still connected!
      client.send(messageStr);
    });
  }

  broadcast(message) {
    const messageStr = JSON.stringify(message);

    // BUG: Not filtering out closed connections!
    this.wss.clients.forEach(client => {
      client.send(messageStr);
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(\`WebSocket server listening on port \${this.port}\`);
    });

    // BUG: Not implementing connection cleanup interval!
  }

  stop() {
    // BUG: Not properly closing all connections!
    this.server.close();
  }
}

module.exports = WebSocketServer;`
    },
    hints: [
      'Implement proper connection cleanup',
      'Add ping/pong for connection health checks',
      'Validate all incoming messages and parameters',
      'Handle WebSocket state properly before sending'
    ],
    solution: {
      'websocket-server.js': `const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const { v4: uuidv4 } = require('uuid');

class WebSocketServer {
  constructor(port = 8080) {
    this.port = port;
    this.server = http.createServer();
    this.wss = new WebSocket.Server({
      server: this.server,
      clientTracking: true
    });

    // Solution: Better data structures for client management
    this.clients = new Map(); // ws -> clientInfo
    this.userConnections = new Map(); // userId -> Set of ws
    this.rooms = new Map(); // roomId -> Set of ws

    // Solution: Connection health monitoring
    this.pingInterval = null;
    this.cleanupInterval = null;

    this.setupWebSocketHandlers();
    this.startHealthChecks();
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, request) => {
      console.log('New WebSocket connection');

      try {
        // Solution: Proper parameter parsing and validation
        const query = url.parse(request.url, true).query;
        const userId = this.validateUserId(query.userId);
        const roomId = query.roomId ? this.validateRoomId(query.roomId) : null;

        // Solution: Generate unique connection ID
        const connectionId = uuidv4();

        const clientInfo = {
          connectionId,
          userId,
          roomId,
          lastSeen: Date.now(),
          isAlive: true,
          connectedAt: Date.now()
        };

        this.clients.set(ws, clientInfo);

        // Solution: Track user connections
        if (!this.userConnections.has(userId)) {
          this.userConnections.set(userId, new Set());
        }
        this.userConnections.get(userId).add(ws);

        // Solution: Handle room joining with proper cleanup
        if (roomId) {
          this.joinRoom(ws, roomId);
        }

        // Solution: Set up ping/pong for connection health
        ws.isAlive = true;
        ws.on('pong', () => {
          ws.isAlive = true;
          clientInfo.lastSeen = Date.now();
        });

        ws.on('message', (data) => {
          this.handleMessage(ws, data);
        });

        ws.on('close', (code, reason) => {
          console.log(\`WebSocket connection closed: \${code} - \${reason}\`);
          this.handleDisconnection(ws);
        });

        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.handleConnectionError(ws, error);
        });

        // Solution: Send welcome message
        this.sendToClient(ws, {
          type: 'connected',
          connectionId,
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Connection setup error:', error);
        ws.close(1008, 'Invalid connection parameters');
      }
    });
  }

  validateUserId(userId) {
    if (!userId || typeof userId !== 'string' || userId.length < 1) {
      throw new Error('Invalid userId');
    }
    return userId.trim();
  }

  validateRoomId(roomId) {
    if (!roomId || typeof roomId !== 'string' || roomId.length < 1) {
      throw new Error('Invalid roomId');
    }
    return roomId.trim();
  }

  handleMessage(ws, data) {
    try {
      // Solution: Validate message format
      const message = JSON.parse(data);

      if (!message.type) {
        throw new Error('Message type is required');
      }

      const clientInfo = this.clients.get(ws);
      if (!clientInfo) {
        throw new Error('Client not found');
      }

      // Solution: Update last seen
      clientInfo.lastSeen = Date.now();

      switch (message.type) {
        case 'chat':
          this.handleChatMessage(ws, message);
          break;

        case 'join_room':
          this.handleJoinRoom(ws, message);
          break;

        case 'leave_room':
          this.handleLeaveRoom(ws, message);
          break;

        case 'ping':
          this.sendToClient(ws, { type: 'pong', timestamp: Date.now() });
          break;

        default:
          this.sendToClient(ws, {
            type: 'error',
            message: \`Unknown message type: \${message.type}\`
          });
      }

    } catch (error) {
      console.error('Message handling error:', error);
      this.sendToClient(ws, {
        type: 'error',
        message: 'Invalid message format'
      });
    }
  }

  handleChatMessage(ws, message) {
    // Solution: Validate chat message
    if (!message.content || typeof message.content !== 'string') {
      throw new Error('Invalid chat message content');
    }

    if (message.content.length > 1000) {
      throw new Error('Message too long');
    }

    const clientInfo = this.clients.get(ws);

    if (!clientInfo.roomId) {
      this.sendToClient(ws, {
        type: 'error',
        message: 'You must join a room to send messages'
      });
      return;
    }

    const chatMessage = {
      type: 'chat',
      userId: clientInfo.userId,
      content: message.content.trim(),
      timestamp: Date.now(),
      messageId: uuidv4()
    };

    this.broadcastToRoom(clientInfo.roomId, chatMessage, ws);
  }

  handleJoinRoom(ws, message) {
    try {
      const roomId = this.validateRoomId(message.roomId);
      this.joinRoom(ws, roomId);
    } catch (error) {
      this.sendToClient(ws, {
        type: 'error',
        message: error.message
      });
    }
  }

  handleLeaveRoom(ws, message) {
    const clientInfo = this.clients.get(ws);
    if (clientInfo.roomId) {
      this.leaveRoom(ws, clientInfo.roomId);
    }
  }

  joinRoom(ws, roomId) {
    const clientInfo = this.clients.get(ws);

    // Solution: Leave previous room first
    if (clientInfo.roomId) {
      this.leaveRoom(ws, clientInfo.roomId);
    }

    // Solution: Create room if it doesn't exist
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId).add(ws);
    clientInfo.roomId = roomId;

    // Solution: Notify client and room members
    this.sendToClient(ws, {
      type: 'room_joined',
      roomId,
      memberCount: this.rooms.get(roomId).size
    });

    this.broadcastToRoom(roomId, {
      type: 'user_joined',
      userId: clientInfo.userId,
      memberCount: this.rooms.get(roomId).size
    }, ws);
  }

  leaveRoom(ws, roomId) {
    const clientInfo = this.clients.get(ws);

    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(ws);

      // Solution: Clean up empty rooms
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
      } else {
        // Notify remaining members
        this.broadcastToRoom(roomId, {
          type: 'user_left',
          userId: clientInfo.userId,
          memberCount: this.rooms.get(roomId).size
        });
      }
    }

    clientInfo.roomId = null;

    this.sendToClient(ws, {
      type: 'room_left',
      roomId
    });
  }

  sendToClient(ws, message) {
    // Solution: Check WebSocket state before sending
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message to client:', error);
        this.handleConnectionError(ws, error);
      }
    }
  }

  broadcastToRoom(roomId, message, excludeWs = null) {
    if (!this.rooms.has(roomId)) return;

    const clients = this.rooms.get(roomId);
    const messageStr = JSON.stringify(message);

    clients.forEach(client => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        try {
          client.send(messageStr);
        } catch (error) {
          console.error('Error broadcasting to client:', error);
          this.handleConnectionError(client, error);
        }
      }
    });
  }

  broadcast(message) {
    const messageStr = JSON.stringify(message);

    // Solution: Filter out closed connections
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(messageStr);
        } catch (error) {
          console.error('Error broadcasting:', error);
        }
      }
    });
  }

  handleDisconnection(ws) {
    const clientInfo = this.clients.get(ws);

    if (clientInfo) {
      // Solution: Clean up user connections
      if (this.userConnections.has(clientInfo.userId)) {
        this.userConnections.get(clientInfo.userId).delete(ws);
        if (this.userConnections.get(clientInfo.userId).size === 0) {
          this.userConnections.delete(clientInfo.userId);
        }
      }

      // Solution: Leave room if in one
      if (clientInfo.roomId) {
        this.leaveRoom(ws, clientInfo.roomId);
      }

      this.clients.delete(ws);
    }
  }

  handleConnectionError(ws, error) {
    console.error('Connection error:', error);

    // Solution: Clean up connection
    this.handleDisconnection(ws);

    if (ws.readyState === WebSocket.OPEN) {
      ws.close(1011, 'Server error');
    }
  }

  startHealthChecks() {
    // Solution: Implement ping/pong health checks
    this.pingInterval = setInterval(() => {
      this.wss.clients.forEach(ws => {
        if (ws.isAlive === false) {
          console.log('Terminating dead connection');
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // Ping every 30 seconds

    // Solution: Clean up stale connections
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const staleThreshold = 5 * 60 * 1000; // 5 minutes

      this.clients.forEach((clientInfo, ws) => {
        if (now - clientInfo.lastSeen > staleThreshold) {
          console.log('Cleaning up stale connection');
          ws.terminate();
        }
      });
    }, 60000); // Check every minute
  }

  getStats() {
    return {
      totalConnections: this.clients.size,
      totalRooms: this.rooms.size,
      totalUsers: this.userConnections.size,
      roomStats: Array.from(this.rooms.entries()).map(([roomId, clients]) => ({
        roomId,
        memberCount: clients.size
      }))
    };
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (error) => {
        if (error) {
          reject(error);
        } else {
          console.log(\`WebSocket server listening on port \${this.port}\`);
          resolve();
        }
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      // Solution: Proper cleanup
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
      }

      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }

      // Close all WebSocket connections
      this.wss.clients.forEach(ws => {
        ws.close(1001, 'Server shutting down');
      });

      // Close the server
      this.server.close(() => {
        console.log('WebSocket server stopped');
        resolve();
      });
    });
  }
}

module.exports = WebSocketServer;`
    },
    testCases: [
      'WebSocket connections should be properly cleaned up',
      'Ping/pong health checks should work correctly',
      'Room management should handle joins and leaves properly',
      'Message validation should prevent invalid data'
    ],
    debuggingSteps: [
      'Monitor connection counts and cleanup',
      'Test ping/pong health check mechanism',
      'Verify room state consistency',
      'Check message validation and error handling'
    ],
    commonMistakes: [
      'Not implementing connection health checks',
      'Not cleaning up disconnected clients properly',
      'Not validating incoming messages',
      'Not checking WebSocket state before sending'
    ],
    productionImpact: 'Memory leaks, connection issues, server instability, poor real-time performance',
    preventionTips: [
      'Implement ping/pong health checks',
      'Always validate incoming messages',
      'Clean up connections and resources properly',
      'Check WebSocket state before operations'
    ]
  },

  // ===== AUTHENTICATION & AUTHORIZATION ISSUES (5 challenges) =====

  {
    id: 'node-jwt-security-vulnerabilities',
    title: 'JWT Security Vulnerabilities',
    description: 'Security issues with JWT implementation and token management',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['Node.js', 'JWT', 'Security', 'Authentication', 'Authorization'],
    rootCause: 'Insecure JWT implementation with multiple security vulnerabilities',
    category: 'Authentication & Authorization',
    files: {
      'auth-service.js': `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./user-model');

class AuthService {
  constructor() {
    // BUG: Weak secret key!
    this.jwtSecret = 'secret123';

    // BUG: No token blacklist mechanism!
    this.blacklistedTokens = new Set();
  }

  async login(email, password) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // BUG: Including sensitive data in JWT payload!
      const payload = {
        userId: user.id,
        email: user.email,
        password: user.password, // BUG: Never include password!
        role: user.role,
        permissions: user.permissions,
        lastLogin: new Date(),
        sessionId: Math.random().toString(36) // BUG: Weak session ID!
      };

      // BUG: No expiration time set!
      const token = jwt.sign(payload, this.jwtSecret);

      // BUG: Not updating last login time!
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(token) {
    try {
      // BUG: Not verifying the token properly!
      const decoded = jwt.decode(token);

      if (!decoded) {
        throw new Error('Invalid token');
      }

      // BUG: Not checking if token is blacklisted!
      // BUG: Not validating token expiration!

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // BUG: Creating new token with same payload!
      const newToken = jwt.sign(decoded, this.jwtSecret);

      return { token: newToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async logout(token) {
    try {
      // BUG: Not properly invalidating the token!
      const decoded = jwt.decode(token);

      if (decoded) {
        // BUG: Adding to blacklist but not checking expiration!
        this.blacklistedTokens.add(token);
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  verifyToken(token) {
    try {
      // BUG: Not checking blacklist!
      // BUG: Using synchronous verification!
      const decoded = jwt.verify(token, this.jwtSecret);

      return decoded;
    } catch (error) {
      // BUG: Not handling different JWT errors properly!
      throw new Error('Invalid token');
    }
  }

  // BUG: No method to clean up expired blacklisted tokens!

  hasPermission(user, permission) {
    // BUG: Weak permission checking!
    return user.permissions && user.permissions.includes(permission);
  }

  isAdmin(user) {
    // BUG: Simple role check without proper validation!
    return user.role === 'admin';
  }
}

module.exports = AuthService;`,
      'auth-middleware.js': `const AuthService = require('./auth-service');

const authService = new AuthService();

// BUG: Middleware with security vulnerabilities!
const authenticateToken = (req, res, next) => {
  // BUG: Not checking multiple token sources!
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // BUG: Not handling token verification errors properly!
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    // BUG: Exposing internal error details!
    return res.status(403).json({ error: error.message });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    // BUG: Not checking if user is authenticated first!
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    // BUG: Weak permission checking!
    if (!req.user || !authService.hasPermission(req.user, permission)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePermission
};`
    },
    hints: [
      'Use strong JWT secrets and proper token expiration',
      'Implement secure token blacklisting mechanism',
      'Never include sensitive data in JWT payload',
      'Properly handle JWT verification errors'
    ],
    solution: {
      'auth-service.js': `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('./user-model');
const RedisClient = require('./redis-client');

class AuthService {
  constructor() {
    // Solution: Use strong secret from environment
    this.jwtSecret = process.env.JWT_SECRET || this.generateSecureSecret();
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || this.generateSecureSecret();

    // Solution: Token expiration times
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';

    // Solution: Use Redis for token blacklisting
    this.redis = new RedisClient();
  }

  generateSecureSecret() {
    // Solution: Generate cryptographically secure secret
    return crypto.randomBytes(64).toString('hex');
  }

  async login(email, password, userAgent, ipAddress) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        // Solution: Generic error message to prevent user enumeration
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        // Solution: Log failed login attempts
        await this.logFailedLogin(email, ipAddress);
        throw new Error('Invalid credentials');
      }

      // Solution: Check for account lockout
      if (await this.isAccountLocked(user.id)) {
        throw new Error('Account is temporarily locked due to multiple failed attempts');
      }

      // Solution: Generate secure session ID
      const sessionId = crypto.randomUUID();

      // Solution: Minimal JWT payload - no sensitive data
      const accessPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId,
        type: 'access'
      };

      const refreshPayload = {
        userId: user.id,
        sessionId,
        type: 'refresh'
      };

      // Solution: Proper token expiration
      const accessToken = jwt.sign(accessPayload, this.jwtSecret, {
        expiresIn: this.accessTokenExpiry,
        issuer: 'your-app',
        audience: 'your-app-users'
      });

      const refreshToken = jwt.sign(refreshPayload, this.jwtRefreshSecret, {
        expiresIn: this.refreshTokenExpiry,
        issuer: 'your-app',
        audience: 'your-app-users'
      });

      // Solution: Store session information
      await this.storeSession(sessionId, {
        userId: user.id,
        userAgent,
        ipAddress,
        createdAt: new Date(),
        lastActivity: new Date()
      });

      // Solution: Update last login
      await User.updateLastLogin(user.id, new Date(), ipAddress);

      // Solution: Clear failed login attempts
      await this.clearFailedLogins(user.id);

      return {
        accessToken,
        refreshToken,
        expiresIn: 15 * 60, // 15 minutes in seconds
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        }
      };
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      // Solution: Verify refresh token with proper secret
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret, {
        issuer: 'your-app',
        audience: 'your-app-users'
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Solution: Check if token is blacklisted
      if (await this.isTokenBlacklisted(refreshToken)) {
        throw new Error('Token has been revoked');
      }

      // Solution: Verify session exists
      const session = await this.getSession(decoded.sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Solution: Generate new access token
      const accessPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: decoded.sessionId,
        type: 'access'
      };

      const accessToken = jwt.sign(accessPayload, this.jwtSecret, {
        expiresIn: this.accessTokenExpiry,
        issuer: 'your-app',
        audience: 'your-app-users'
      });

      // Solution: Update session activity
      await this.updateSessionActivity(decoded.sessionId);

      return {
        accessToken,
        expiresIn: 15 * 60
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      }
      throw error;
    }
  }

  async logout(token, sessionId) {
    try {
      // Solution: Blacklist the token
      await this.blacklistToken(token);

      // Solution: Remove session
      if (sessionId) {
        await this.removeSession(sessionId);
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async logoutAllSessions(userId) {
    try {
      // Solution: Remove all user sessions
      const sessions = await this.getUserSessions(userId);

      for (const session of sessions) {
        await this.removeSession(session.sessionId);
      }

      return { success: true, sessionsRemoved: sessions.length };
    } catch (error) {
      console.error('Logout all sessions error:', error);
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      // Solution: Check blacklist first
      if (await this.isTokenBlacklisted(token)) {
        throw new Error('Token has been revoked');
      }

      // Solution: Verify with proper options
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'your-app',
        audience: 'your-app-users'
      });

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      // Solution: Verify session is still active
      const session = await this.getSession(decoded.sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Solution: Update session activity
      await this.updateSessionActivity(decoded.sessionId);

      return decoded;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      throw error;
    }
  }

  // Solution: Secure permission checking
  async hasPermission(userId, permission) {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return false;
    }

    // Check direct permissions
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }

    // Check role-based permissions
    const rolePermissions = await this.getRolePermissions(user.role);
    return rolePermissions.includes(permission);
  }

  async isAdmin(userId) {
    const user = await User.findById(userId);
    return user && user.isActive && user.role === 'admin';
  }

  // Solution: Token blacklisting with Redis
  async blacklistToken(token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await this.redis.setex(\`blacklist:\${token}\`, ttl, 'true');
        }
      }
    } catch (error) {
      console.error('Error blacklisting token:', error);
    }
  }

  async isTokenBlacklisted(token) {
    try {
      const result = await this.redis.get(\`blacklist:\${token}\`);
      return result === 'true';
    } catch (error) {
      console.error('Error checking blacklist:', error);
      return false;
    }
  }

  // Solution: Session management
  async storeSession(sessionId, sessionData) {
    const key = \`session:\${sessionId}\`;
    await this.redis.setex(key, 7 * 24 * 60 * 60, JSON.stringify(sessionData)); // 7 days
  }

  async getSession(sessionId) {
    try {
      const data = await this.redis.get(\`session:\${sessionId}\`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  async updateSessionActivity(sessionId) {
    const session = await this.getSession(sessionId);
    if (session) {
      session.lastActivity = new Date();
      await this.storeSession(sessionId, session);
    }
  }

  async removeSession(sessionId) {
    await this.redis.del(\`session:\${sessionId}\`);
  }

  async getUserSessions(userId) {
    // Implementation would depend on your session storage strategy
    // This is a simplified version
    const keys = await this.redis.keys('session:*');
    const sessions = [];

    for (const key of keys) {
      const sessionData = await this.redis.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.userId === userId) {
          sessions.push({
            sessionId: key.replace('session:', ''),
            ...session
          });
        }
      }
    }

    return sessions;
  }

  // Solution: Account lockout protection
  async logFailedLogin(email, ipAddress) {
    const key = \`failed_login:\${email}\`;
    const attempts = await this.redis.incr(key);
    await this.redis.expire(key, 15 * 60); // 15 minutes

    if (attempts >= 5) {
      await this.lockAccount(email, 30 * 60); // Lock for 30 minutes
    }
  }

  async isAccountLocked(userId) {
    const result = await this.redis.get(\`locked:\${userId}\`);
    return result === 'true';
  }

  async lockAccount(email, duration) {
    const user = await User.findByEmail(email);
    if (user) {
      await this.redis.setex(\`locked:\${user.id}\`, duration, 'true');
    }
  }

  async clearFailedLogins(userId) {
    const user = await User.findById(userId);
    if (user) {
      await this.redis.del(\`failed_login:\${user.email}\`);
      await this.redis.del(\`locked:\${userId}\`);
    }
  }

  async getRolePermissions(role) {
    // This would typically come from a database
    const rolePermissions = {
      'admin': ['read', 'write', 'delete', 'manage_users'],
      'editor': ['read', 'write'],
      'viewer': ['read']
    };

    return rolePermissions[role] || [];
  }
}

module.exports = AuthService;`,
      'auth-middleware.js': `const AuthService = require('./auth-service');
const rateLimit = require('express-rate-limit');

const authService = new AuthService();

// Solution: Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Solution: Secure token authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    // Solution: Check multiple token sources
    let token = null;

    // Check Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Check cookie as fallback
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Solution: Proper token verification with error handling
    const user = await authService.verifyToken(token);
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    // Solution: Proper error handling without exposing internals
    let statusCode = 403;
    let errorCode = 'TOKEN_INVALID';
    let message = 'Invalid or expired token';

    if (error.message === 'Token expired') {
      statusCode = 401;
      errorCode = 'TOKEN_EXPIRED';
      message = 'Token has expired';
    } else if (error.message === 'Token has been revoked') {
      statusCode = 401;
      errorCode = 'TOKEN_REVOKED';
      message = 'Token has been revoked';
    }

    return res.status(statusCode).json({
      error: message,
      code: errorCode
    });
  }
};

// Solution: Secure role-based authorization
const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Solution: Check authentication first
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // Solution: Verify user is still active
      const User = require('./user-model');
      const user = await User.findById(req.user.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'User account is inactive',
          code: 'USER_INACTIVE'
        });
      }

      // Solution: Check role hierarchy
      const roleHierarchy = {
        'admin': 3,
        'editor': 2,
        'viewer': 1
      };

      const userRoleLevel = roleHierarchy[user.role] || 0;
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        return res.status(403).json({
          error: 'Insufficient role permissions',
          code: 'INSUFFICIENT_ROLE',
          required: requiredRole,
          current: user.role
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        error: 'Authorization check failed',
        code: 'AUTH_CHECK_FAILED'
      });
    }
  };
};

// Solution: Secure permission-based authorization
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // Solution: Check permission with proper validation
      const hasPermission = await authService.hasPermission(req.user.userId, permission);

      if (!hasPermission) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSION',
          required: permission
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        error: 'Permission check failed',
        code: 'PERMISSION_CHECK_FAILED'
      });
    }
  };
};

// Solution: Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (token) {
      try {
        const user = await authService.verifyToken(token);
        req.user = user;
        req.token = token;
      } catch (error) {
        // Ignore token errors for optional auth
        req.user = null;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePermission,
  optionalAuth,
  authRateLimit
};`
    },
    testCases: [
      'JWT tokens should use strong secrets and proper expiration',
      'Token blacklisting should work correctly',
      'Sensitive data should not be included in JWT payload',
      'Authentication middleware should handle errors securely'
    ],
    debuggingSteps: [
      'Check JWT secret strength and configuration',
      'Verify token blacklisting mechanism',
      'Test permission and role checking logic',
      'Validate error handling and security measures'
    ],
    commonMistakes: [
      'Using weak JWT secrets',
      'Including sensitive data in JWT payload',
      'Not implementing token blacklisting',
      'Poor error handling exposing internal details'
    ],
    productionImpact: 'Security vulnerabilities, unauthorized access, data breaches, compliance issues',
    preventionTips: [
      'Use strong, environment-based JWT secrets',
      'Implement proper token expiration and refresh',
      'Never include sensitive data in JWT payload',
      'Use secure token blacklisting with Redis'
    ]
  },

  // ===== FILE SYSTEM & I/O ISSUES (5 challenges) =====

  {
    id: 'node-file-operations-race-conditions',
    title: 'File Operations Race Conditions',
    description: 'Race conditions and concurrency issues in file system operations',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '22 min',
    xpReward: 160,
    tags: ['Node.js', 'File System', 'Race Conditions', 'Concurrency', 'I/O'],
    rootCause: 'Improper handling of concurrent file operations and lack of proper locking',
    category: 'File System & I/O',
    files: {
      'file-manager.js': `const fs = require('fs').promises;
const path = require('path');

class FileManager {
  constructor(baseDir = './data') {
    this.baseDir = baseDir;
    this.activeOperations = new Map(); // BUG: Not using proper locking!
  }

  async ensureDirectory() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
    } catch (error) {
      // BUG: Not handling EEXIST error properly!
      console.error('Error creating directory:', error);
      throw error;
    }
  }

  async writeFile(filename, data) {
    const filePath = path.join(this.baseDir, filename);

    try {
      // BUG: No locking mechanism for concurrent writes!
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(\`File written: \${filename}\`);
    } catch (error) {
      console.error(\`Error writing file \${filename}:\`, error);
      throw error;
    }
  }

  async readFile(filename) {
    const filePath = path.join(this.baseDir, filename);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // BUG: Not distinguishing between different error types!
      console.error(\`Error reading file \${filename}:\`, error);
      throw error;
    }
  }

  async appendToFile(filename, newData) {
    try {
      // BUG: Race condition - read and write not atomic!
      const existingData = await this.readFile(filename);

      if (Array.isArray(existingData)) {
        existingData.push(newData);
      } else {
        existingData.items = existingData.items || [];
        existingData.items.push(newData);
      }

      // BUG: Another process might modify file between read and write!
      await this.writeFile(filename, existingData);
    } catch (error) {
      // BUG: If file doesn't exist, should create it!
      console.error('Error appending to file:', error);
      throw error;
    }
  }

  async updateCounter(filename) {
    try {
      // BUG: Classic race condition!
      let counter = 0;

      try {
        const data = await this.readFile(filename);
        counter = data.count || 0;
      } catch (error) {
        // File doesn't exist, start with 0
      }

      counter++;

      // BUG: Multiple processes can read same value and increment!
      await this.writeFile(filename, { count: counter, lastUpdated: new Date() });

      return counter;
    } catch (error) {
      console.error('Error updating counter:', error);
      throw error;
    }
  }

  async batchWrite(files) {
    // BUG: No coordination between batch operations!
    const promises = files.map(({ filename, data }) =>
      this.writeFile(filename, data)
    );

    try {
      await Promise.all(promises);
      console.log('Batch write completed');
    } catch (error) {
      // BUG: Partial failure handling is poor!
      console.error('Batch write failed:', error);
      throw error;
    }
  }

  async copyFile(source, destination) {
    try {
      // BUG: Not handling large files efficiently!
      const data = await this.readFile(source);
      await this.writeFile(destination, data);
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  }

  async deleteFile(filename) {
    const filePath = path.join(this.baseDir, filename);

    try {
      await fs.unlink(filePath);
      console.log(\`File deleted: \${filename}\`);
    } catch (error) {
      // BUG: Not handling ENOENT error gracefully!
      console.error(\`Error deleting file \${filename}:\`, error);
      throw error;
    }
  }

  async listFiles() {
    try {
      const files = await fs.readdir(this.baseDir);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // BUG: No cleanup method for active operations!
}

module.exports = FileManager;`,
      'usage-example.js': `const FileManager = require('./file-manager');

async function demonstrateRaceConditions() {
  const fileManager = new FileManager('./test-data');

  await fileManager.ensureDirectory();

  // BUG: This will cause race conditions!
  console.log('Starting concurrent operations...');

  // Multiple processes trying to update counter simultaneously
  const counterPromises = Array.from({ length: 10 }, (_, i) =>
    fileManager.updateCounter('counter.json')
  );

  // Multiple processes trying to append to same file
  const appendPromises = Array.from({ length: 5 }, (_, i) =>
    fileManager.appendToFile('log.json', {
      message: \`Log entry \${i}\`,
      timestamp: new Date()
    })
  );

  try {
    const [counterResults, appendResults] = await Promise.all([
      Promise.all(counterPromises),
      Promise.all(appendPromises)
    ]);

    console.log('Counter results:', counterResults);
    console.log('Final counter value should be 10, but might be less due to race conditions');

    const finalData = await fileManager.readFile('log.json');
    console.log('Log entries count:', finalData.items?.length || 0);
    console.log('Should have 5 entries, but might have fewer due to race conditions');

  } catch (error) {
    console.error('Operations failed:', error);
  }
}

// Run the demonstration
demonstrateRaceConditions().catch(console.error);`
    },
    hints: [
      'Implement file locking mechanism',
      'Use atomic operations for critical sections',
      'Handle different file system error types properly',
      'Implement proper cleanup and resource management'
    ],
    solution: {
      'file-manager.js': `const fs = require('fs').promises;
const path = require('path');
const { createWriteStream, createReadStream } = require('fs');
const { pipeline } = require('stream').promises;

class FileManager {
  constructor(baseDir = './data') {
    this.baseDir = baseDir;
    // Solution: Proper locking mechanism
    this.fileLocks = new Map(); // filename -> Promise
    this.lockTimeouts = new Map(); // filename -> timeout
    this.maxLockTime = 30000; // 30 seconds max lock time
  }

  async ensureDirectory() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
    } catch (error) {
      // Solution: Handle EEXIST error gracefully
      if (error.code !== 'EEXIST') {
        console.error('Error creating directory:', error);
        throw error;
      }
    }
  }

  // Solution: File locking mechanism
  async acquireLock(filename) {
    const lockKey = path.resolve(this.baseDir, filename);

    // Wait for existing lock to release
    while (this.fileLocks.has(lockKey)) {
      await this.fileLocks.get(lockKey);
    }

    // Create new lock
    let releaseLock;
    const lockPromise = new Promise((resolve) => {
      releaseLock = resolve;
    });

    this.fileLocks.set(lockKey, lockPromise);

    // Set timeout to prevent deadlocks
    const timeout = setTimeout(() => {
      console.warn(\`Lock timeout for file: \${filename}\`);
      this.releaseLock(filename);
    }, this.maxLockTime);

    this.lockTimeouts.set(lockKey, timeout);

    return () => this.releaseLock(filename);
  }

  releaseLock(filename) {
    const lockKey = path.resolve(this.baseDir, filename);

    // Clear timeout
    const timeout = this.lockTimeouts.get(lockKey);
    if (timeout) {
      clearTimeout(timeout);
      this.lockTimeouts.delete(lockKey);
    }

    // Release lock
    const lockPromise = this.fileLocks.get(lockKey);
    if (lockPromise) {
      this.fileLocks.delete(lockKey);
      // Resolve the promise to release waiting operations
      lockPromise.then = () => Promise.resolve();
    }
  }

  async writeFile(filename, data, options = {}) {
    const filePath = path.join(this.baseDir, filename);
    const releaseLock = await this.acquireLock(filename);

    try {
      // Solution: Atomic write using temporary file
      const tempPath = \`\${filePath}.tmp\`;
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

      await fs.writeFile(tempPath, jsonData, 'utf8');

      // Atomic rename
      await fs.rename(tempPath, filePath);

      console.log(\`File written atomically: \${filename}\`);
    } catch (error) {
      console.error(\`Error writing file \${filename}:\`, error);
      throw error;
    } finally {
      releaseLock();
    }
  }

  async readFile(filename, options = {}) {
    const filePath = path.join(this.baseDir, filename);

    try {
      const data = await fs.readFile(filePath, 'utf8');

      if (options.raw) {
        return data;
      }

      try {
        return JSON.parse(data);
      } catch (parseError) {
        console.warn(\`File \${filename} contains invalid JSON, returning raw data\`);
        return data;
      }
    } catch (error) {
      // Solution: Distinguish between different error types
      if (error.code === 'ENOENT') {
        if (options.defaultValue !== undefined) {
          return options.defaultValue;
        }
        throw new Error(\`File not found: \${filename}\`);
      } else if (error.code === 'EACCES') {
        throw new Error(\`Permission denied: \${filename}\`);
      } else {
        console.error(\`Error reading file \${filename}:\`, error);
        throw error;
      }
    }
  }

  async appendToFile(filename, newData) {
    const releaseLock = await this.acquireLock(filename);

    try {
      // Solution: Atomic read-modify-write operation
      let existingData;

      try {
        existingData = await this.readFile(filename);
      } catch (error) {
        if (error.message.includes('File not found')) {
          // Solution: Create file if it doesn't exist
          existingData = { items: [] };
        } else {
          throw error;
        }
      }

      // Ensure proper data structure
      if (Array.isArray(existingData)) {
        existingData.push(newData);
      } else {
        existingData.items = existingData.items || [];
        existingData.items.push(newData);
        existingData.lastModified = new Date().toISOString();
      }

      // Write atomically
      await this.writeFile(filename, existingData);

      return existingData;
    } catch (error) {
      console.error('Error appending to file:', error);
      throw error;
    } finally {
      releaseLock();
    }
  }

  async updateCounter(filename) {
    const releaseLock = await this.acquireLock(filename);

    try {
      // Solution: Atomic counter update
      let counterData;

      try {
        counterData = await this.readFile(filename);
      } catch (error) {
        if (error.message.includes('File not found')) {
          counterData = { count: 0 };
        } else {
          throw error;
        }
      }

      const newCount = (counterData.count || 0) + 1;
      const updatedData = {
        count: newCount,
        lastUpdated: new Date().toISOString(),
        updateHistory: [
          ...(counterData.updateHistory || []).slice(-9), // Keep last 10
          { count: newCount, timestamp: new Date().toISOString() }
        ]
      };

      await this.writeFile(filename, updatedData);

      return newCount;
    } catch (error) {
      console.error('Error updating counter:', error);
      throw error;
    } finally {
      releaseLock();
    }
  }

  async batchWrite(files, options = {}) {
    const { maxConcurrency = 3, continueOnError = false } = options;

    // Solution: Controlled concurrency and better error handling
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i += maxConcurrency) {
      const batch = files.slice(i, i + maxConcurrency);

      const batchPromises = batch.map(async ({ filename, data }, index) => {
        try {
          await this.writeFile(filename, data);
          return { filename, success: true, index: i + index };
        } catch (error) {
          const errorInfo = { filename, error, index: i + index };
          errors.push(errorInfo);

          if (!continueOnError) {
            throw error;
          }

          return { filename, success: false, error, index: i + index };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    console.log(\`Batch write completed: \${results.filter(r => r.success).length}/\${files.length} successful\`);

    if (errors.length > 0 && !continueOnError) {
      throw new Error(\`Batch write failed: \${errors.length} errors\`);
    }

    return {
      results,
      errors,
      successful: results.filter(r => r.success).length,
      failed: errors.length
    };
  }

  async copyFile(source, destination, options = {}) {
    const { useStreams = true, chunkSize = 64 * 1024 } = options;
    const sourcePath = path.join(this.baseDir, source);
    const destPath = path.join(this.baseDir, destination);

    try {
      // Check if source exists
      await fs.access(sourcePath);

      if (useStreams) {
        // Solution: Use streams for large files
        const readStream = createReadStream(sourcePath);
        const writeStream = createWriteStream(destPath);

        await pipeline(readStream, writeStream);
      } else {
        // For small files, use direct copy
        await fs.copyFile(sourcePath, destPath);
      }

      console.log(\`File copied: \${source} -> \${destination}\`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(\`Source file not found: \${source}\`);
      }
      console.error('Error copying file:', error);
      throw error;
    }
  }

  async deleteFile(filename, options = {}) {
    const { force = false } = options;
    const filePath = path.join(this.baseDir, filename);

    try {
      await fs.unlink(filePath);
      console.log(\`File deleted: \${filename}\`);
    } catch (error) {
      // Solution: Handle ENOENT error gracefully
      if (error.code === 'ENOENT') {
        if (!force) {
          throw new Error(\`File not found: \${filename}\`);
        }
        console.log(\`File already deleted: \${filename}\`);
      } else {
        console.error(\`Error deleting file \${filename}:\`, error);
        throw error;
      }
    }
  }

  async listFiles(options = {}) {
    const { pattern = /\\.json$/, includeStats = false } = options;

    try {
      const files = await fs.readdir(this.baseDir);
      const filteredFiles = files.filter(file => pattern.test(file));

      if (includeStats) {
        const filesWithStats = await Promise.all(
          filteredFiles.map(async (file) => {
            const filePath = path.join(this.baseDir, file);
            const stats = await fs.stat(filePath);
            return {
              name: file,
              size: stats.size,
              modified: stats.mtime,
              created: stats.birthtime
            };
          })
        );
        return filesWithStats;
      }

      return filteredFiles;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async fileExists(filename) {
    const filePath = path.join(this.baseDir, filename);

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileStats(filename) {
    const filePath = path.join(this.baseDir, filename);

    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  // Solution: Cleanup method
  async cleanup() {
    // Release all locks
    for (const [filename] of this.fileLocks) {
      this.releaseLock(path.basename(filename));
    }

    // Clear all timeouts
    for (const timeout of this.lockTimeouts.values()) {
      clearTimeout(timeout);
    }

    this.fileLocks.clear();
    this.lockTimeouts.clear();

    console.log('FileManager cleanup completed');
  }

  // Solution: Health check method
  getStatus() {
    return {
      activeLocks: this.fileLocks.size,
      activeTimeouts: this.lockTimeouts.size,
      baseDirectory: this.baseDir
    };
  }
}

module.exports = FileManager;`,
      'usage-example.js': `const FileManager = require('./file-manager');

async function demonstrateSafeOperations() {
  const fileManager = new FileManager('./test-data');

  try {
    await fileManager.ensureDirectory();

    console.log('Starting concurrent operations with proper locking...');

    // Solution: These operations are now safe from race conditions
    const counterPromises = Array.from({ length: 10 }, (_, i) =>
      fileManager.updateCounter('counter.json')
    );

    const appendPromises = Array.from({ length: 5 }, (_, i) =>
      fileManager.appendToFile('log.json', {
        message: \`Log entry \${i}\`,
        timestamp: new Date().toISOString(),
        processId: process.pid
      })
    );

    const [counterResults] = await Promise.all([
      Promise.all(counterPromises),
      Promise.all(appendPromises)
    ]);

    console.log('Counter results:', counterResults);
    console.log('Final counter should be exactly 10');

    const finalCounterData = await fileManager.readFile('counter.json');
    console.log('Final counter value:', finalCounterData.count);

    const finalLogData = await fileManager.readFile('log.json');
    console.log('Log entries count:', finalLogData.items?.length || 0);
    console.log('Should have exactly 5 entries');

    // Demonstrate batch operations
    const batchFiles = Array.from({ length: 5 }, (_, i) => ({
      filename: \`batch-\${i}.json\`,
      data: { id: i, created: new Date().toISOString() }
    }));

    const batchResult = await fileManager.batchWrite(batchFiles, {
      maxConcurrency: 2,
      continueOnError: true
    });

    console.log('Batch operation result:', batchResult);

    // List all files
    const files = await fileManager.listFiles({ includeStats: true });
    console.log('Files in directory:', files);

    // Get manager status
    console.log('FileManager status:', fileManager.getStatus());

  } catch (error) {
    console.error('Operations failed:', error);
  } finally {
    // Solution: Proper cleanup
    await fileManager.cleanup();
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

// Run the demonstration
demonstrateSafeOperations().catch(console.error);`
    },
    testCases: [
      'Concurrent file operations should not cause race conditions',
      'File locking mechanism should prevent data corruption',
      'Error handling should distinguish between different error types',
      'Atomic operations should ensure data consistency'
    ],
    debuggingSteps: [
      'Test concurrent operations with multiple processes',
      'Verify file locking prevents race conditions',
      'Check error handling for different scenarios',
      'Monitor file system operations and locks'
    ],
    commonMistakes: [
      'Not implementing proper file locking',
      'Using non-atomic read-modify-write operations',
      'Poor error handling for file system operations',
      'Not cleaning up resources and locks'
    ],
    productionImpact: 'Data corruption, race conditions, file system errors, resource leaks',
    preventionTips: [
      'Implement proper file locking mechanisms',
      'Use atomic operations for critical file updates',
      'Handle all file system error types appropriately',
      'Always clean up resources and locks'
    ]
  },

  // ===== API DESIGN & VALIDATION ISSUES (5 challenges) =====

  {
    id: 'node-api-validation-security',
    title: 'API Input Validation and Security Issues',
    description: 'Security vulnerabilities and validation issues in REST API endpoints',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '28 min',
    xpReward: 200,
    tags: ['Node.js', 'API Security', 'Input Validation', 'Express.js', 'Security'],
    rootCause: 'Insufficient input validation and security measures in API endpoints',
    category: 'API Design & Validation',
    files: {
      'user-api.js': `const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user-model');

const router = express.Router();

// BUG: No input validation middleware!
router.post('/users', async (req, res) => {
  try {
    // BUG: Direct access to req.body without validation!
    const { name, email, password, role, permissions } = req.body;

    // BUG: No password strength validation!
    const hashedPassword = await bcrypt.hash(password, 10);

    // BUG: No duplicate email checking!
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // BUG: Allowing role assignment without authorization!
      permissions: permissions || [] // BUG: Allowing permission assignment!
    });

    await user.save();

    // BUG: Returning sensitive data!
    res.status(201).json(user);
  } catch (error) {
    // BUG: Exposing internal error details!
    res.status(500).json({ error: error.message });
  }
});

// BUG: No authentication middleware!
router.get('/users/:id', async (req, res) => {
  try {
    // BUG: No input validation for ID parameter!
    const userId = req.params.id;

    // BUG: No authorization check!
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // BUG: Returning sensitive data including password hash!
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // BUG: No validation of update data!
    const updateData = req.body;

    // BUG: Allowing password updates without current password verification!
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // BUG: No authorization - users can update any user!
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BUG: No rate limiting on sensitive endpoint!
router.post('/users/login', async (req, res) => {
  try {
    // BUG: No input validation!
    const { email, password } = req.body;

    // BUG: Case-sensitive email lookup!
    const user = await User.findOne({ email });

    if (!user) {
      // BUG: Different error message reveals user existence!
      return res.status(401).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // BUG: Different error message for invalid password!
      return res.status(401).json({ error: 'Invalid password' });
    }

    // BUG: No failed login attempt tracking!

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default-secret', // BUG: Fallback to weak secret!
      { expiresIn: '24h' } // BUG: Long expiration time!
    );

    // BUG: Returning sensitive user data!
    res.json({
      token,
      user: user // Contains password hash and other sensitive data!
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // BUG: No soft delete - permanent deletion!
    // BUG: No authorization check!
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // BUG: Returning deleted user data!
    res.json({ message: 'User deleted', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BUG: Admin endpoint without proper security!
router.get('/admin/users', async (req, res) => {
  try {
    // BUG: No pagination - could return massive datasets!
    // BUG: No authorization check for admin role!
    const users = await User.find({});

    // BUG: Returning all user data including passwords!
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;`,
      'middleware.js': `// BUG: Incomplete and insecure middleware implementations!

const jwt = require('jsonwebtoken');

// BUG: Weak authentication middleware!
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // BUG: Not handling Bearer token format!
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// BUG: No input validation middleware!
const validateInput = (schema) => {
  return (req, res, next) => {
    // BUG: Empty validation function!
    next();
  };
};

// BUG: Weak authorization middleware!
const authorize = (roles) => {
  return (req, res, next) => {
    // BUG: Not checking if user is authenticated first!
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  validateInput,
  authorize
};`
    },
    hints: [
      'Implement comprehensive input validation',
      'Add proper authentication and authorization',
      'Sanitize output data to prevent information leakage',
      'Add rate limiting and security headers'
    ],
    solution: {
      'user-api.js': `const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, param, query, validationResult } = require('express-validator');
const User = require('./user-model');
const { authenticate, authorize, validateInput } = require('./middleware');

const router = express.Router();

// Solution: Apply security middleware
router.use(helmet());

// Solution: Rate limiting for sensitive endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(generalRateLimit);

// Solution: Comprehensive input validation for user creation
const createUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\\s]+$/)
    .withMessage('Name must be 2-50 characters and contain only letters and spaces'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/)
    .withMessage('Password must be 8-128 characters with uppercase, lowercase, number, and special character'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array')
];

router.post('/users', createUserValidation, async (req, res) => {
  try {
    // Solution: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, password, role, permissions } = req.body;

    // Solution: Check for existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Solution: Strong password hashing
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Solution: Controlled role and permission assignment
    const userRole = role && req.user?.role === 'admin' ? role : 'user';
    const userPermissions = permissions && req.user?.role === 'admin' ? permissions : [];

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      permissions: userPermissions,
      createdAt: new Date(),
      isActive: true,
      loginAttempts: 0,
      lockUntil: null
    });

    await user.save();

    // Solution: Return safe user data
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive
    };

    res.status(201).json({
      message: 'User created successfully',
      user: safeUser
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'USER_CREATION_FAILED'
    });
  }
});

// Solution: Protected endpoint with validation
const getUserValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format')
];

router.get('/users/:id', authenticate, getUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.params.id;
    const requestingUserId = req.user.userId;
    const requestingUserRole = req.user.role;

    // Solution: Authorization check - users can only view their own data or admins can view any
    if (userId !== requestingUserId && requestingUserRole !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Solution: Return only safe user data
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive
    };

    res.json(safeUser);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'USER_FETCH_FAILED'
    });
  }
});

// Solution: Secure user update with validation
const updateUserValidation = [
  param('id').isMongoId().withMessage('Invalid user ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\\s]+$/)
    .withMessage('Name must be 2-50 characters and contain only letters and spaces'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Must be a valid email address'),
  body('currentPassword')
    .if(body('newPassword').exists())
    .notEmpty()
    .withMessage('Current password is required when changing password'),
  body('newPassword')
    .optional()
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/)
    .withMessage('New password must meet security requirements')
];

router.put('/users/:id', authenticate, updateUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.params.id;
    const requestingUserId = req.user.userId;
    const requestingUserRole = req.user.role;

    // Solution: Authorization check
    if (userId !== requestingUserId && requestingUserRole !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const { name, email, currentPassword, newPassword, role, permissions } = req.body;
    const updateData = {};

    // Solution: Validate current password before allowing updates
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          error: 'Current password is required',
          code: 'CURRENT_PASSWORD_REQUIRED'
        });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Solution: Controlled field updates
    if (name) updateData.name = name.trim();

    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'Email already in use',
          code: 'EMAIL_ALREADY_EXISTS'
        });
      }

      updateData.email = email.toLowerCase();
    }

    // Solution: Only admins can update role and permissions
    if (requestingUserRole === 'admin') {
      if (role) updateData.role = role;
      if (permissions) updateData.permissions = permissions;
    }

    updateData.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password -__v' }
    );

    const safeUser = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
      updatedAt: updatedUser.updatedAt
    };

    res.json({
      message: 'User updated successfully',
      user: safeUser
    });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'USER_UPDATE_FAILED'
    });
  }
});

// Solution: Secure login with rate limiting and proper validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

router.post('/users/login', authRateLimit, loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;
    const clientIP = req.ip;

    // Solution: Case-insensitive email lookup
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true
    });

    // Solution: Generic error message to prevent user enumeration
    const genericError = {
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    };

    if (!user) {
      // Log failed attempt for monitoring
      console.log(\`Failed login attempt for non-existent user: \${email} from \${clientIP}\`);
      return res.status(401).json(genericError);
    }

    // Solution: Check for account lockout
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({
        error: 'Account temporarily locked due to too many failed attempts',
        code: 'ACCOUNT_LOCKED'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Solution: Track failed login attempts
      await User.findByIdAndUpdate(user._id, {
        $inc: { loginAttempts: 1 },
        $set: {
          lockUntil: user.loginAttempts >= 4 ? Date.now() + 30 * 60 * 1000 : undefined // Lock for 30 minutes after 5 attempts
        }
      });

      console.log(\`Failed login attempt for user: \${email} from \${clientIP}\`);
      return res.status(401).json(genericError);
    }

    // Solution: Reset login attempts on successful login
    await User.findByIdAndUpdate(user._id, {
      $unset: { loginAttempts: 1, lockUntil: 1 },
      $set: { lastLogin: new Date(), lastLoginIP: clientIP }
    });

    // Solution: Secure JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h', // Solution: Shorter expiration time
        issuer: 'your-app',
        audience: 'your-app-users'
      }
    );

    // Solution: Return only safe user data
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      lastLogin: new Date()
    };

    res.json({
      message: 'Login successful',
      token,
      user: safeUser,
      expiresIn: 3600 // 1 hour in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'LOGIN_FAILED'
    });
  }
});

// Solution: Secure soft delete
router.delete('/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;

    // Solution: Soft delete instead of permanent deletion
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isActive: false,
        deletedAt: new Date(),
        deletedBy: req.user.userId
      },
      { new: true, select: '-password -__v' }
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      message: 'User deactivated successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'USER_DELETION_FAILED'
    });
  }
});

// Solution: Secure admin endpoint with pagination
const adminUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term too long')
];

router.get('/admin/users', authenticate, authorize(['admin']), adminUsersValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    // Solution: Build search query
    let query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Solution: Paginated results with safe data
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    const safeUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive
    }));

    res.json({
      users: safeUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'ADMIN_USERS_FETCH_FAILED'
    });
  }
});

module.exports = router;`,
      'middleware.js': `const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { validationResult } = require('express-validator');

// Solution: Robust authentication middleware
const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Solution: Handle Bearer token format
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Fallback to cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Solution: Verify token with proper options
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'your-app',
      audience: 'your-app-users'
    });

    // Solution: Additional token validation
    if (!decoded.userId || !decoded.email) {
      return res.status(401).json({
        error: 'Invalid token format',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Solution: Check token age (optional additional security)
    const tokenAge = Date.now() / 1000 - decoded.iat;
    const maxTokenAge = 24 * 60 * 60; // 24 hours

    if (tokenAge > maxTokenAge) {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    let errorResponse = {
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    };

    if (error.name === 'TokenExpiredError') {
      errorResponse = {
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      };
    } else if (error.name === 'JsonWebTokenError') {
      errorResponse = {
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      };
    }

    res.status(401).json(errorResponse);
  }
};

// Solution: Comprehensive input validation middleware
const validateInput = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(error => ({
          field: error.param,
          message: error.msg,
          value: error.value
        }))
      });
    }

    next();
  };
};

// Solution: Robust authorization middleware
const authorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Solution: Check if user is authenticated first
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      // Solution: Validate user role
      if (!req.user.role) {
        return res.status(403).json({
          error: 'User role not found',
          code: 'ROLE_MISSING'
        });
      }

      // Solution: Check if user role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: allowedRoles,
          current: req.user.role
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({
        error: 'Authorization check failed',
        code: 'AUTH_CHECK_FAILED'
      });
    }
  };
};

// Solution: Permission-based authorization
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userPermissions = req.user.permissions || [];

      // Admin role has all permissions
      if (req.user.role === 'admin') {
        return next();
      }

      if (!userPermissions.includes(permission)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: 'PERMISSION_DENIED',
          required: permission
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        error: 'Permission check failed',
        code: 'PERMISSION_CHECK_FAILED'
      });
    }
  };
};

// Solution: Request sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove potentially dangerous characters
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/<script[^>]*>.*?<\\/script>/gi, '')
                .replace(/<[^>]+>/g, '')
                .trim();
    } else if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  if (req.query) {
    req.query = sanitize(req.query);
  }

  next();
};

// Solution: Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// Solution: Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.originalUrl} - \${res.statusCode} - \${duration}ms - \${req.ip}\`);
  });

  next();
};

module.exports = {
  authenticate,
  validateInput,
  authorize,
  requirePermission,
  sanitizeInput,
  securityHeaders,
  requestLogger
};`
    },
    testCases: [
      'API endpoints should validate all input parameters',
      'Authentication and authorization should be properly implemented',
      'Sensitive data should not be exposed in responses',
      'Rate limiting should prevent abuse'
    ],
    debuggingSteps: [
      'Test input validation with malicious payloads',
      'Verify authentication and authorization logic',
      'Check for information leakage in error responses',
      'Test rate limiting and security headers'
    ],
    commonMistakes: [
      'Missing input validation on API endpoints',
      'Exposing sensitive data in API responses',
      'Weak authentication and authorization',
      'Not implementing proper rate limiting'
    ],
    productionImpact: 'Security vulnerabilities, data breaches, unauthorized access, API abuse',
    preventionTips: [
      'Always validate and sanitize input data',
      'Implement proper authentication and authorization',
      'Never expose sensitive data in API responses',
      'Use rate limiting and security headers'
    ]
  },

  // ===== MICROSERVICES & DISTRIBUTED SYSTEMS (4 challenges) =====

  {
    id: 'node-microservice-communication',
    title: 'Microservice Communication Issues',
    description: 'Problems with service-to-service communication, circuit breakers, and resilience',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '30 min',
    xpReward: 220,
    tags: ['Node.js', 'Microservices', 'Circuit Breaker', 'Service Discovery', 'Resilience'],
    rootCause: 'Poor error handling and lack of resilience patterns in microservice communication',
    category: 'Microservices & Distributed Systems',
    files: {
      'user-service.js': `const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// BUG: Hardcoded service URLs!
const ORDER_SERVICE_URL = 'http://localhost:3002';
const NOTIFICATION_SERVICE_URL = 'http://localhost:3003';

// BUG: No circuit breaker pattern!
// BUG: No retry logic!
// BUG: No timeout handling!

app.get('/users/:id/profile', async (req, res) => {
  try {
    const userId = req.params.id;

    // BUG: No input validation!
    const user = await getUserFromDB(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // BUG: Synchronous calls to multiple services - no parallelization!
    // BUG: No error handling for service failures!
    const orders = await axios.get(\`\${ORDER_SERVICE_URL}/orders/user/\${userId}\`);
    const notifications = await axios.get(\`\${NOTIFICATION_SERVICE_URL}/notifications/user/\${userId}\`);

    // BUG: Not handling partial failures!
    res.json({
      user,
      orders: orders.data,
      notifications: notifications.data
    });
  } catch (error) {
    // BUG: Generic error handling!
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/users/:id/process-order', async (req, res) => {
  try {
    const userId = req.params.id;
    const orderData = req.body;

    // BUG: No distributed transaction handling!
    // BUG: No compensation logic for failures!

    // Step 1: Create order
    const orderResponse = await axios.post(\`\${ORDER_SERVICE_URL}/orders\`, {
      userId,
      ...orderData
    });

    // Step 2: Update user points
    await updateUserPoints(userId, -orderData.pointsUsed);

    // Step 3: Send notification
    await axios.post(\`\${NOTIFICATION_SERVICE_URL}/notifications\`, {
      userId,
      type: 'order_created',
      orderId: orderResponse.data.id
    });

    res.json({
      success: true,
      orderId: orderResponse.data.id
    });
  } catch (error) {
    // BUG: No rollback mechanism!
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Order processing failed' });
  }
});

// BUG: No health check endpoint!
// BUG: No graceful shutdown handling!

async function getUserFromDB(userId) {
  // Simulate database call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        points: 1000
      });
    }, 100);
  });
}

async function updateUserPoints(userId, pointsChange) {
  // Simulate database update
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // BUG: Random failures not handled!
      if (Math.random() < 0.1) {
        reject(new Error('Database update failed'));
      } else {
        resolve();
      }
    }, 50);
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`User service running on port \${PORT}\`);
});`,
      'service-client.js': `const axios = require('axios');

class ServiceClient {
  constructor(baseURL, serviceName) {
    this.baseURL = baseURL;
    this.serviceName = serviceName;

    // BUG: No default timeout!
    this.client = axios.create({
      baseURL: this.baseURL
    });

    // BUG: No retry configuration!
    // BUG: No circuit breaker!
  }

  async get(path, options = {}) {
    try {
      // BUG: No request timeout!
      const response = await this.client.get(path);
      return response.data;
    } catch (error) {
      // BUG: Not distinguishing between error types!
      console.error(\`\${this.serviceName} GET error:\`, error.message);
      throw error;
    }
  }

  async post(path, data, options = {}) {
    try {
      const response = await this.client.post(path, data);
      return response.data;
    } catch (error) {
      console.error(\`\${this.serviceName} POST error:\`, error.message);
      throw error;
    }
  }

  // BUG: No health check method!
  // BUG: No circuit breaker status!
}

module.exports = ServiceClient;`,
      'config.js': `// BUG: Configuration not environment-aware!
module.exports = {
  services: {
    userService: 'http://localhost:3001',
    orderService: 'http://localhost:3002',
    notificationService: 'http://localhost:3003'
  },

  // BUG: No timeout configurations!
  // BUG: No retry configurations!
  // BUG: No circuit breaker configurations!

  database: {
    host: 'localhost',
    port: 5432,
    name: 'myapp'
  }
};`
    },
    hints: [
      'Implement circuit breaker pattern for service calls',
      'Add proper retry logic with exponential backoff',
      'Handle partial failures gracefully',
      'Implement distributed transaction patterns'
    ],
    solution: {
      'user-service.js': `const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('opossum');
const { promisify } = require('util');
const config = require('./config');
const ServiceClient = require('./service-client');

const app = express();
app.use(express.json());

// Solution: Service discovery and configuration
const orderService = new ServiceClient(config.services.orderService, 'OrderService');
const notificationService = new ServiceClient(config.services.notificationService, 'NotificationService');

// Solution: Circuit breaker configuration
const circuitBreakerOptions = {
  timeout: 5000, // 5 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000, // 30 seconds
  rollingCountTimeout: 10000,
  rollingCountBuckets: 10
};

// Solution: Circuit breakers for external services
const orderServiceBreaker = new CircuitBreaker(
  (path, options) => orderService.get(path, options),
  { ...circuitBreakerOptions, name: 'OrderService' }
);

const notificationServiceBreaker = new CircuitBreaker(
  (path, options) => notificationService.get(path, options),
  { ...circuitBreakerOptions, name: 'NotificationService' }
);

// Solution: Circuit breaker event handling
orderServiceBreaker.on('open', () => console.log('Order service circuit breaker opened'));
orderServiceBreaker.on('halfOpen', () => console.log('Order service circuit breaker half-open'));
orderServiceBreaker.on('close', () => console.log('Order service circuit breaker closed'));

notificationServiceBreaker.on('open', () => console.log('Notification service circuit breaker opened'));
notificationServiceBreaker.on('halfOpen', () => console.log('Notification service circuit breaker half-open'));
notificationServiceBreaker.on('close', () => console.log('Notification service circuit breaker closed'));

// Solution: Input validation middleware
const validateUserId = (req, res, next) => {
  const userId = req.params.id;
  if (!userId || !/^\\d+$/.test(userId)) {
    return res.status(400).json({
      error: 'Invalid user ID',
      code: 'INVALID_USER_ID'
    });
  }
  next();
};

app.get('/users/:id/profile', validateUserId, async (req, res) => {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    const userId = req.params.id;

    console.log(\`[REQ:\${requestId}] Fetching profile for user \${userId}\`);

    // Get user data
    const user = await getUserFromDB(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Solution: Parallel service calls with fallback handling
    const servicePromises = [
      orderServiceBreaker.fire(\`/orders/user/\${userId}\`)
        .catch(error => {
          console.warn(\`[REQ:\${requestId}] Order service failed:\`, error.message);
          return { orders: [], error: 'Orders temporarily unavailable' };
        }),

      notificationServiceBreaker.fire(\`/notifications/user/\${userId}\`)
        .catch(error => {
          console.warn(\`[REQ:\${requestId}] Notification service failed:\`, error.message);
          return { notifications: [], error: 'Notifications temporarily unavailable' };
        })
    ];

    const [ordersResult, notificationsResult] = await Promise.allSettled(servicePromises);

    // Solution: Handle partial failures gracefully
    const response = {
      user,
      orders: ordersResult.status === 'fulfilled' ? ordersResult.value : [],
      notifications: notificationsResult.status === 'fulfilled' ? notificationsResult.value : [],
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        serviceStatus: {
          orders: ordersResult.status === 'fulfilled' ? 'available' : 'degraded',
          notifications: notificationsResult.status === 'fulfilled' ? 'available' : 'degraded'
        }
      }
    };

    // Add warnings for failed services
    if (ordersResult.status === 'rejected') {
      response.warnings = response.warnings || [];
      response.warnings.push('Order history temporarily unavailable');
    }

    if (notificationsResult.status === 'rejected') {
      response.warnings = response.warnings || [];
      response.warnings.push('Notification history temporarily unavailable');
    }

    console.log(\`[REQ:\${requestId}] Profile fetch completed in \${Date.now() - startTime}ms\`);
    res.json(response);

  } catch (error) {
    console.error(\`[REQ:\${requestId}] Error fetching user profile:\`, error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'PROFILE_FETCH_FAILED',
      requestId
    });
  }
});

// Solution: Saga pattern for distributed transactions
class OrderProcessingSaga {
  constructor(userId, orderData, requestId) {
    this.userId = userId;
    this.orderData = orderData;
    this.requestId = requestId;
    this.steps = [];
    this.compensations = [];
  }

  async execute() {
    try {
      // Step 1: Create order
      console.log(\`[REQ:\${this.requestId}] Creating order\`);
      const orderResult = await orderService.post('/orders', {
        userId: this.userId,
        ...this.orderData
      });

      this.steps.push({ step: 'order_created', data: orderResult });
      this.compensations.unshift(() => this.cancelOrder(orderResult.id));

      // Step 2: Update user points
      console.log(\`[REQ:\${this.requestId}] Updating user points\`);
      await updateUserPoints(this.userId, -this.orderData.pointsUsed);

      this.steps.push({ step: 'points_updated', pointsUsed: this.orderData.pointsUsed });
      this.compensations.unshift(() => this.restoreUserPoints(this.userId, this.orderData.pointsUsed));

      // Step 3: Send notification (non-critical, can fail)
      try {
        console.log(\`[REQ:\${this.requestId}] Sending notification\`);
        await notificationService.post('/notifications', {
          userId: this.userId,
          type: 'order_created',
          orderId: orderResult.id
        });

        this.steps.push({ step: 'notification_sent' });
      } catch (notificationError) {
        console.warn(\`[REQ:\${this.requestId}] Notification failed (non-critical):\`, notificationError.message);
        // Don't fail the entire saga for notification failures
      }

      console.log(\`[REQ:\${this.requestId}] Order processing saga completed successfully\`);
      return {
        success: true,
        orderId: orderResult.id,
        steps: this.steps
      };

    } catch (error) {
      console.error(\`[REQ:\${this.requestId}] Order processing saga failed:\`, error.message);
      await this.compensate();
      throw error;
    }
  }

  async compensate() {
    console.log(\`[REQ:\${this.requestId}] Starting compensation for \${this.compensations.length} steps\`);

    for (const compensation of this.compensations) {
      try {
        await compensation();
      } catch (compensationError) {
        console.error(\`[REQ:\${this.requestId}] Compensation failed:\`, compensationError.message);
        // Log but continue with other compensations
      }
    }

    console.log(\`[REQ:\${this.requestId}] Compensation completed\`);
  }

  async cancelOrder(orderId) {
    console.log(\`[REQ:\${this.requestId}] Compensating: Cancelling order \${orderId}\`);
    await orderService.delete(\`/orders/\${orderId}\`);
  }

  async restoreUserPoints(userId, points) {
    console.log(\`[REQ:\${this.requestId}] Compensating: Restoring \${points} points to user \${userId}\`);
    await updateUserPoints(userId, points);
  }
}

app.post('/users/:id/process-order', validateUserId, async (req, res) => {
  const requestId = generateRequestId();
  const userId = req.params.id;
  const orderData = req.body;

  // Solution: Input validation
  if (!orderData || !orderData.pointsUsed || orderData.pointsUsed <= 0) {
    return res.status(400).json({
      error: 'Invalid order data',
      code: 'INVALID_ORDER_DATA',
      requestId
    });
  }

  try {
    console.log(\`[REQ:\${requestId}] Starting order processing for user \${userId}\`);

    // Solution: Use saga pattern for distributed transaction
    const saga = new OrderProcessingSaga(userId, orderData, requestId);
    const result = await saga.execute();

    res.json({
      ...result,
      requestId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(\`[REQ:\${requestId}] Order processing failed:\`, error.message);

    let statusCode = 500;
    let errorCode = 'ORDER_PROCESSING_FAILED';

    if (error.response) {
      statusCode = error.response.status;
      if (statusCode === 400) {
        errorCode = 'INVALID_ORDER_REQUEST';
      } else if (statusCode === 404) {
        errorCode = 'ORDER_SERVICE_NOT_FOUND';
      }
    }

    res.status(statusCode).json({
      error: 'Order processing failed',
      code: errorCode,
      requestId,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Solution: Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {}
  };

  // Check external service health
  try {
    await orderService.get('/health', { timeout: 2000 });
    health.services.orderService = 'healthy';
  } catch (error) {
    health.services.orderService = 'unhealthy';
    health.status = 'degraded';
  }

  try {
    await notificationService.get('/health', { timeout: 2000 });
    health.services.notificationService = 'healthy';
  } catch (error) {
    health.services.notificationService = 'unhealthy';
    health.status = 'degraded';
  }

  // Check circuit breaker status
  health.circuitBreakers = {
    orderService: orderServiceBreaker.stats,
    notificationService: notificationServiceBreaker.stats
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Solution: Metrics endpoint
app.get('/metrics', (req, res) => {
  const metrics = {
    circuitBreakers: {
      orderService: orderServiceBreaker.stats,
      notificationService: notificationServiceBreaker.stats
    },
    process: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    }
  };

  res.json(metrics);
});

// Solution: Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
  console.log(\`Received \${signal}. Starting graceful shutdown...\`);

  // Close circuit breakers
  orderServiceBreaker.shutdown();
  notificationServiceBreaker.shutdown();

  // Close server
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.log('Force exiting...');
    process.exit(1);
  }, 10000);
}

// Helper functions
async function getUserFromDB(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        points: 1000
      });
    }, 100);
  });
}

async function updateUserPoints(userId, pointsChange) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) { // 5% failure rate
        reject(new Error('Database update failed'));
      } else {
        resolve();
      }
    }, 50);
  });
}

function generateRequestId() {
  return Math.random().toString(36).substring(2, 15);
}

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(\`User service running on port \${PORT}\`);
});`,
      'service-client.js': `const axios = require('axios');
const axiosRetry = require('axios-retry');

class ServiceClient {
  constructor(baseURL, serviceName, options = {}) {
    this.baseURL = baseURL;
    this.serviceName = serviceName;
    this.options = {
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      ...options
    };

    // Solution: Configure axios with timeout and interceptors
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.options.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': \`ServiceClient/1.0 (\${serviceName})\`
      }
    });

    // Solution: Configure retry logic
    axiosRetry(this.client, {
      retries: this.options.retries,
      retryDelay: (retryCount) => {
        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        const jitter = Math.random() * 0.1 * delay;
        return delay + jitter;
      },
      retryCondition: (error) => {
        // Retry on network errors and 5xx responses
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response && error.response.status >= 500);
      }
    });

    // Solution: Request interceptor for logging and correlation IDs
    this.client.interceptors.request.use(
      (config) => {
        const requestId = this.generateRequestId();
        config.headers['X-Request-ID'] = requestId;
        config.metadata = { startTime: Date.now(), requestId };

        console.log(\`[REQ:\${requestId}] \${this.serviceName} \${config.method.toUpperCase()} \${config.url}\`);
        return config;
      },
      (error) => {
        console.error(\`\${this.serviceName} request setup error:\`, error.message);
        return Promise.reject(error);
      }
    );

    // Solution: Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        const { requestId, startTime } = response.config.metadata;
        const duration = Date.now() - startTime;

        console.log(\`[REQ:\${requestId}] \${this.serviceName} response: \${response.status} (\${duration}ms)\`);
        return response;
      },
      (error) => {
        const config = error.config;
        const requestId = config?.metadata?.requestId || 'unknown';
        const startTime = config?.metadata?.startTime || Date.now();
        const duration = Date.now() - startTime;

        if (error.response) {
          console.error(\`[REQ:\${requestId}] \${this.serviceName} error: \${error.response.status} (\${duration}ms) - \${error.response.statusText}\`);
        } else if (error.request) {
          console.error(\`[REQ:\${requestId}] \${this.serviceName} network error (\${duration}ms): \${error.message}\`);
        } else {
          console.error(\`[REQ:\${requestId}] \${this.serviceName} request error: \${error.message}\`);
        }

        return Promise.reject(this.enhanceError(error));
      }
    );
  }

  async get(path, options = {}) {
    try {
      const response = await this.client.get(path, {
        timeout: options.timeout || this.options.timeout,
        ...options
      });
      return response.data;
    } catch (error) {
      throw this.handleServiceError(error, 'GET', path);
    }
  }

  async post(path, data, options = {}) {
    try {
      const response = await this.client.post(path, data, {
        timeout: options.timeout || this.options.timeout,
        ...options
      });
      return response.data;
    } catch (error) {
      throw this.handleServiceError(error, 'POST', path);
    }
  }

  async put(path, data, options = {}) {
    try {
      const response = await this.client.put(path, data, {
        timeout: options.timeout || this.options.timeout,
        ...options
      });
      return response.data;
    } catch (error) {
      throw this.handleServiceError(error, 'PUT', path);
    }
  }

  async delete(path, options = {}) {
    try {
      const response = await this.client.delete(path, {
        timeout: options.timeout || this.options.timeout,
        ...options
      });
      return response.data;
    } catch (error) {
      throw this.handleServiceError(error, 'DELETE', path);
    }
  }

  // Solution: Health check method
  async healthCheck(timeout = 2000) {
    try {
      const response = await this.client.get('/health', { timeout });
      return {
        status: 'healthy',
        service: this.serviceName,
        responseTime: response.headers['x-response-time'] || 'unknown',
        data: response.data
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: this.serviceName,
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      };
    }
  }

  // Solution: Get service statistics
  getStats() {
    return {
      service: this.serviceName,
      baseURL: this.baseURL,
      timeout: this.options.timeout,
      retries: this.options.retries
    };
  }

  // Solution: Enhanced error handling
  handleServiceError(error, method, path) {
    const serviceError = new Error(\`\${this.serviceName} \${method} \${path} failed: \${error.message}\`);

    serviceError.service = this.serviceName;
    serviceError.method = method;
    serviceError.path = path;
    serviceError.originalError = error;

    if (error.response) {
      serviceError.status = error.response.status;
      serviceError.statusText = error.response.statusText;
      serviceError.data = error.response.data;
      serviceError.type = 'HTTP_ERROR';
    } else if (error.request) {
      serviceError.type = 'NETWORK_ERROR';
      serviceError.code = error.code;
    } else {
      serviceError.type = 'REQUEST_SETUP_ERROR';
    }

    return serviceError;
  }

  enhanceError(error) {
    // Add additional context to errors
    const enhanced = { ...error };
    enhanced.service = this.serviceName;
    enhanced.timestamp = new Date().toISOString();

    if (error.code === 'ECONNREFUSED') {
      enhanced.message = \`\${this.serviceName} is not available (connection refused)\`;
    } else if (error.code === 'ETIMEDOUT') {
      enhanced.message = \`\${this.serviceName} request timed out\`;
    }

    return enhanced;
  }

  generateRequestId() {
    return Math.random().toString(36).substring(2, 15);
  }
}

module.exports = ServiceClient;`,
      'config.js': `// Solution: Environment-aware configuration
const config = {
  environment: process.env.NODE_ENV || 'development',

  services: {
    userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
    notificationService: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003'
  },

  // Solution: Timeout configurations
  timeouts: {
    default: parseInt(process.env.DEFAULT_TIMEOUT) || 5000,
    database: parseInt(process.env.DB_TIMEOUT) || 3000,
    external: parseInt(process.env.EXTERNAL_TIMEOUT) || 10000
  },

  // Solution: Retry configurations
  retry: {
    attempts: parseInt(process.env.RETRY_ATTEMPTS) || 3,
    baseDelay: parseInt(process.env.RETRY_BASE_DELAY) || 1000,
    maxDelay: parseInt(process.env.RETRY_MAX_DELAY) || 10000
  },

  // Solution: Circuit breaker configurations
  circuitBreaker: {
    timeout: parseInt(process.env.CB_TIMEOUT) || 5000,
    errorThresholdPercentage: parseInt(process.env.CB_ERROR_THRESHOLD) || 50,
    resetTimeout: parseInt(process.env.CB_RESET_TIMEOUT) || 30000,
    rollingCountTimeout: parseInt(process.env.CB_ROLLING_COUNT_TIMEOUT) || 10000,
    rollingCountBuckets: parseInt(process.env.CB_ROLLING_COUNT_BUCKETS) || 10
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'myapp',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT) || 60000,
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000
    }
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  },

  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT) || 9090
  }
};

// Solution: Configuration validation
function validateConfig() {
  const required = [
    'services.userService',
    'services.orderService',
    'services.notificationService'
  ];

  for (const key of required) {
    const value = key.split('.').reduce((obj, k) => obj && obj[k], config);
    if (!value) {
      throw new Error(\`Missing required configuration: \${key}\`);
    }
  }

  console.log('Configuration validated successfully');
}

// Validate configuration on load
validateConfig();

module.exports = config;`
    },
    testCases: [
      'Circuit breakers should open when error threshold is reached',
      'Service calls should retry with exponential backoff',
      'Partial failures should be handled gracefully',
      'Distributed transactions should implement compensation'
    ],
    debuggingSteps: [
      'Test circuit breaker behavior under load',
      'Verify retry logic and backoff strategies',
      'Check saga compensation logic',
      'Monitor service health and metrics'
    ],
    commonMistakes: [
      'Not implementing circuit breaker patterns',
      'Missing retry logic for transient failures',
      'Poor handling of partial service failures',
      'Lack of distributed transaction management'
    ],
    productionImpact: 'Service cascading failures, poor resilience, data inconsistency, system downtime',
    preventionTips: [
      'Implement circuit breakers for all external service calls',
      'Use retry logic with exponential backoff',
      'Handle partial failures gracefully with fallbacks',
      'Implement saga pattern for distributed transactions'
    ]
  },

  // ===== REAL-TIME & WEBSOCKET ISSUES (3 challenges) =====

  {
    id: 'node-realtime-chat-issues',
    title: 'Real-time Chat Application Issues',
    description: 'Problems with Socket.IO implementation, room management, and message handling',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 190,
    tags: ['Node.js', 'Socket.IO', 'Real-time', 'WebSocket', 'Chat', 'Room Management'],
    rootCause: 'Poor Socket.IO implementation and lack of proper event handling',
    category: 'Real-time & WebSocket',
    files: {
      'chat-server.js': `const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// BUG: No CORS configuration!
const io = socketIo(server);

// BUG: No authentication middleware!
// BUG: No rate limiting!
// BUG: Global variables for state management!
let users = {}; // BUG: Not using proper data structure!
let rooms = {}; // BUG: Memory leak potential!

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // BUG: No input validation!
  socket.on('join', (userData) => {
    // BUG: No validation of userData!
    users[socket.id] = userData;

    // BUG: Broadcasting sensitive information!
    socket.broadcast.emit('user-joined', userData);
  });

  // BUG: No room validation!
  socket.on('join-room', (roomName) => {
    // BUG: No room name validation!
    socket.join(roomName);

    // BUG: Not tracking room membership properly!
    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }
    rooms[roomName].push(socket.id);

    // BUG: Not handling duplicate joins!
    socket.to(roomName).emit('user-joined-room', {
      userId: socket.id,
      user: users[socket.id]
    });
  });

  // BUG: No message validation or sanitization!
  socket.on('message', (messageData) => {
    // BUG: No rate limiting on messages!
    // BUG: No message content validation!
    // BUG: No profanity filtering!

    const message = {
      id: Date.now(), // BUG: Not a proper unique ID!
      user: users[socket.id],
      content: messageData.content,
      timestamp: new Date(),
      room: messageData.room
    };

    // BUG: Not checking if user is in room!
    io.to(messageData.room).emit('message', message);
  });

  // BUG: No proper cleanup on disconnect!
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // BUG: Not removing user from rooms!
    delete users[socket.id];

    // BUG: Not notifying other users!
  });

  // BUG: No error handling!
  // BUG: No heartbeat/ping mechanism!
});

// BUG: No graceful shutdown handling!
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Chat server running on port \${PORT}\`);
});`,
      'chat-client.js': `// BUG: No connection error handling!
const socket = io();

// BUG: No reconnection logic!
// BUG: No connection state management!

class ChatClient {
  constructor() {
    this.currentRoom = null;
    this.user = null;

    // BUG: No event cleanup!
    this.setupEventListeners();
  }

  setupEventListeners() {
    // BUG: No error handling for events!
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      // BUG: No reconnection attempt!
    });

    socket.on('message', (message) => {
      // BUG: No message validation!
      this.displayMessage(message);
    });

    socket.on('user-joined', (user) => {
      // BUG: No validation of user data!
      console.log('User joined:', user);
    });

    // BUG: No handling of connection errors!
    // BUG: No handling of server errors!
  }

  joinRoom(roomName, userData) {
    // BUG: No input validation!
    this.currentRoom = roomName;
    this.user = userData;

    socket.emit('join', userData);
    socket.emit('join-room', roomName);
  }

  sendMessage(content) {
    // BUG: No validation of message content!
    // BUG: No check if user is in a room!

    socket.emit('message', {
      content: content,
      room: this.currentRoom
    });
  }

  displayMessage(message) {
    // BUG: No XSS protection!
    const messageElement = document.createElement('div');
    messageElement.innerHTML = \`
      <strong>\${message.user.name}:</strong> \${message.content}
    \`; // BUG: Direct HTML injection!

    document.getElementById('messages').appendChild(messageElement);
  }
}

// BUG: No proper initialization!
const chatClient = new ChatClient();`,
      'message-validator.js': `// BUG: Incomplete validation logic!

class MessageValidator {
  static validate(message) {
    // BUG: No null/undefined checks!
    if (message.content.length > 1000) {
      return false;
    }

    // BUG: No profanity filtering!
    // BUG: No spam detection!
    // BUG: No rate limiting!

    return true;
  }

  static sanitize(content) {
    // BUG: Basic sanitization only!
    return content.replace(/<script>/g, '');
  }
}

module.exports = MessageValidator;`
    },
    hints: [
      'Implement proper Socket.IO authentication and authorization',
      'Add comprehensive input validation and sanitization',
      'Implement proper room management and cleanup',
      'Add rate limiting and error handling'
    ],
    solution: {
      'chat-server.js': `const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const MessageValidator = require('./message-validator');
const RoomManager = require('./room-manager');
const UserManager = require('./user-manager');

const app = express();
const server = http.createServer(app);

// Solution: Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Solution: Rate limiting
const messageRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute per IP
  message: 'Too many messages, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
});

// Solution: Proper Socket.IO configuration with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Solution: Proper data management
const roomManager = new RoomManager();
const userManager = new UserManager();

// Solution: Authentication middleware for Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');

    // Validate user exists and is active
    const user = await userManager.validateUser(decoded.userId);
    if (!user) {
      return next(new Error('Invalid user'));
    }

    socket.userId = user.id;
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
});

// Solution: Rate limiting for socket events
const createRateLimiter = (maxRequests, windowMs) => {
  const requests = new Map();

  return (socket, next) => {
    const key = socket.userId;
    const now = Date.now();

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const userRequests = requests.get(key);

    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return next(new Error('Rate limit exceeded'));
    }

    validRequests.push(now);
    requests.set(key, validRequests);

    next();
  };
};

const messageRateLimiter = createRateLimiter(30, 60000); // 30 messages per minute
const joinRateLimiter = createRateLimiter(10, 60000); // 10 room joins per minute

io.on('connection', (socket) => {
  console.log(\`User connected: \${socket.user.name} (\${socket.userId})\`);

  // Solution: Track user connection
  userManager.addConnection(socket.userId, socket.id);

  // Solution: Notify user of successful connection
  socket.emit('connected', {
    userId: socket.userId,
    user: socket.user,
    timestamp: new Date().toISOString()
  });

  // Solution: Proper room joining with validation
  socket.on('join-room', joinRateLimiter, async (data, callback) => {
    try {
      const { roomName, password } = data;

      // Validate room name
      if (!MessageValidator.validateRoomName(roomName)) {
        return callback({
          success: false,
          error: 'Invalid room name'
        });
      }

      // Check if room exists and validate password if required
      const room = await roomManager.getRoom(roomName);
      if (room && room.password && room.password !== password) {
        return callback({
          success: false,
          error: 'Invalid room password'
        });
      }

      // Leave current room if in one
      if (socket.currentRoom) {
        await this.leaveRoom(socket, socket.currentRoom);
      }

      // Join new room
      socket.join(roomName);
      socket.currentRoom = roomName;

      // Add user to room
      await roomManager.addUserToRoom(roomName, socket.userId, socket.user);

      // Get room info
      const roomInfo = await roomManager.getRoomInfo(roomName);

      // Notify user of successful join
      callback({
        success: true,
        room: roomInfo
      });

      // Notify other users in room
      socket.to(roomName).emit('user-joined-room', {
        user: socket.user,
        timestamp: new Date().toISOString(),
        roomUsers: roomInfo.users
      });

      console.log(\`User \${socket.user.name} joined room: \${roomName}\`);

    } catch (error) {
      console.error('Join room error:', error);
      callback({
        success: false,
        error: 'Failed to join room'
      });
    }
  });

  // Solution: Comprehensive message handling
  socket.on('message', messageRateLimiter, async (messageData, callback) => {
    try {
      // Validate message data
      const validation = MessageValidator.validateMessage(messageData);
      if (!validation.isValid) {
        return callback({
          success: false,
          error: validation.error
        });
      }

      // Check if user is in a room
      if (!socket.currentRoom) {
        return callback({
          success: false,
          error: 'You must join a room first'
        });
      }

      // Verify user is still in the room
      const isInRoom = await roomManager.isUserInRoom(socket.currentRoom, socket.userId);
      if (!isInRoom) {
        return callback({
          success: false,
          error: 'You are not in this room'
        });
      }

      // Create message object
      const message = {
        id: uuidv4(),
        userId: socket.userId,
        user: {
          id: socket.user.id,
          name: socket.user.name,
          avatar: socket.user.avatar
        },
        content: MessageValidator.sanitizeContent(messageData.content),
        type: messageData.type || 'text',
        room: socket.currentRoom,
        timestamp: new Date().toISOString(),
        edited: false
      };

      // Store message
      await roomManager.addMessage(socket.currentRoom, message);

      // Broadcast message to room
      io.to(socket.currentRoom).emit('message', message);

      // Confirm message sent
      callback({
        success: true,
        messageId: message.id
      });

      console.log(\`Message sent in \${socket.currentRoom} by \${socket.user.name}\`);

    } catch (error) {
      console.error('Message error:', error);
      callback({
        success: false,
        error: 'Failed to send message'
      });
    }
  });

  // Solution: Typing indicators
  socket.on('typing-start', (data) => {
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit('user-typing', {
        userId: socket.userId,
        user: socket.user,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('typing-stop', (data) => {
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit('user-stopped-typing', {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Solution: Get room history
  socket.on('get-room-history', async (data, callback) => {
    try {
      if (!socket.currentRoom) {
        return callback({
          success: false,
          error: 'Not in a room'
        });
      }

      const { limit = 50, before } = data;
      const messages = await roomManager.getMessages(socket.currentRoom, limit, before);

      callback({
        success: true,
        messages
      });

    } catch (error) {
      console.error('Get history error:', error);
      callback({
        success: false,
        error: 'Failed to get room history'
      });
    }
  });

  // Solution: Leave room
  socket.on('leave-room', async (callback) => {
    try {
      if (socket.currentRoom) {
        await this.leaveRoom(socket, socket.currentRoom);
        callback({ success: true });
      } else {
        callback({
          success: false,
          error: 'Not in a room'
        });
      }
    } catch (error) {
      console.error('Leave room error:', error);
      callback({
        success: false,
        error: 'Failed to leave room'
      });
    }
  });

  // Solution: Proper disconnect handling
  socket.on('disconnect', async (reason) => {
    console.log(\`User disconnected: \${socket.user.name} (\${reason})\`);

    try {
      // Remove from current room
      if (socket.currentRoom) {
        await this.leaveRoom(socket, socket.currentRoom);
      }

      // Remove connection tracking
      userManager.removeConnection(socket.userId, socket.id);

    } catch (error) {
      console.error('Disconnect cleanup error:', error);
    }
  });

  // Solution: Error handling
  socket.on('error', (error) => {
    console.error(\`Socket error for user \${socket.user.name}:\`, error);
    socket.emit('error', {
      message: 'An error occurred',
      timestamp: new Date().toISOString()
    });
  });
});

// Solution: Helper method for leaving rooms
async function leaveRoom(socket, roomName) {
  socket.leave(roomName);

  // Remove user from room
  await roomManager.removeUserFromRoom(roomName, socket.userId);

  // Notify other users
  socket.to(roomName).emit('user-left-room', {
    user: socket.user,
    timestamp: new Date().toISOString()
  });

  socket.currentRoom = null;
  console.log(\`User \${socket.user.name} left room: \${roomName}\`);
}

// Solution: Heartbeat mechanism
setInterval(() => {
  io.emit('ping', { timestamp: Date.now() });
}, 30000);

// Solution: Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
  console.log(\`Received \${signal}. Starting graceful shutdown...\`);

  // Notify all connected clients
  io.emit('server-shutdown', {
    message: 'Server is shutting down',
    timestamp: new Date().toISOString()
  });

  // Close server
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.log('Force exiting...');
    process.exit(1);
  }, 10000);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Chat server running on port \${PORT}\`);
});`,
      'chat-client.js': `class ChatClient {
  constructor(serverUrl, options = {}) {
    this.serverUrl = serverUrl;
    this.options = {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      ...options
    };

    this.socket = null;
    this.currentRoom = null;
    this.user = null;
    this.connectionState = 'disconnected';
    this.messageQueue = [];
    this.eventListeners = new Map();
    this.typingTimeout = null;

    this.setupEventHandlers();
  }

  // Solution: Proper connection with authentication
  async connect(token) {
    try {
      this.socket = io(this.serverUrl, {
        ...this.options,
        auth: { token }
      });

      this.setupSocketEventListeners();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, this.options.timeout);

        this.socket.on('connected', (data) => {
          clearTimeout(timeout);
          this.connectionState = 'connected';
          this.user = data.user;
          this.processMessageQueue();
          resolve(data);
        });

        this.socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          this.connectionState = 'error';
          reject(error);
        });
      });
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  setupSocketEventListeners() {
    // Solution: Connection state management
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connectionState = 'connected';
      this.emit('connection-state-changed', 'connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.connectionState = 'disconnected';
      this.emit('connection-state-changed', 'disconnected');

      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect automatically
        this.emit('server-disconnect');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(\`Reconnected after \${attemptNumber} attempts\`);
      this.connectionState = 'connected';
      this.emit('reconnected', attemptNumber);
      this.processMessageQueue();
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(\`Reconnection attempt \${attemptNumber}\`);
      this.connectionState = 'reconnecting';
      this.emit('connection-state-changed', 'reconnecting');
    });

    this.socket.on('reconnect_failed', () => {
      console.log('Reconnection failed');
      this.connectionState = 'failed';
      this.emit('connection-state-changed', 'failed');
    });

    // Solution: Message handling with validation
    this.socket.on('message', (message) => {
      if (this.validateMessage(message)) {
        this.emit('message', message);
      } else {
        console.warn('Received invalid message:', message);
      }
    });

    // Solution: Room event handling
    this.socket.on('user-joined-room', (data) => {
      this.emit('user-joined', data);
    });

    this.socket.on('user-left-room', (data) => {
      this.emit('user-left', data);
    });

    // Solution: Typing indicators
    this.socket.on('user-typing', (data) => {
      this.emit('user-typing', data);
    });

    this.socket.on('user-stopped-typing', (data) => {
      this.emit('user-stopped-typing', data);
    });

    // Solution: Server events
    this.socket.on('server-shutdown', (data) => {
      this.emit('server-shutdown', data);
    });

    this.socket.on('ping', (data) => {
      this.socket.emit('pong', { timestamp: Date.now() });
    });

    // Solution: Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });
  }

  // Solution: Proper room joining with callback
  async joinRoom(roomName, password = null) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('Not connected to server'));
        return;
      }

      if (!this.validateRoomName(roomName)) {
        reject(new Error('Invalid room name'));
        return;
      }

      this.socket.emit('join-room', { roomName, password }, (response) => {
        if (response.success) {
          this.currentRoom = roomName;
          this.emit('room-joined', response.room);
          resolve(response.room);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Solution: Comprehensive message sending
  async sendMessage(content, type = 'text') {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        // Queue message for later sending
        this.messageQueue.push({ content, type, resolve, reject });
        return;
      }

      if (!this.currentRoom) {
        reject(new Error('Not in a room'));
        return;
      }

      if (!this.validateMessageContent(content)) {
        reject(new Error('Invalid message content'));
        return;
      }

      const messageData = {
        content: content.trim(),
        type,
        timestamp: new Date().toISOString()
      };

      this.socket.emit('message', messageData, (response) => {
        if (response.success) {
          resolve(response.messageId);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Solution: Typing indicators with debouncing
  startTyping() {
    if (!this.isConnected() || !this.currentRoom) return;

    this.socket.emit('typing-start');

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Auto-stop typing after 3 seconds
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 3000);
  }

  stopTyping() {
    if (!this.isConnected() || !this.currentRoom) return;

    this.socket.emit('typing-stop');

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  // Solution: Get room history
  async getRoomHistory(limit = 50, before = null) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('Not connected to server'));
        return;
      }

      if (!this.currentRoom) {
        reject(new Error('Not in a room'));
        return;
      }

      this.socket.emit('get-room-history', { limit, before }, (response) => {
        if (response.success) {
          resolve(response.messages);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Solution: Leave room
  async leaveRoom() {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('Not connected to server'));
        return;
      }

      this.socket.emit('leave-room', (response) => {
        if (response.success) {
          this.currentRoom = null;
          this.emit('room-left');
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  // Solution: Event system
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(\`Error in event listener for \${event}:\`, error);
        }
      });
    }
  }

  // Solution: Validation methods
  validateMessage(message) {
    return message &&
           typeof message.id === 'string' &&
           typeof message.content === 'string' &&
           message.user &&
           typeof message.user.name === 'string' &&
           typeof message.timestamp === 'string';
  }

  validateRoomName(roomName) {
    return typeof roomName === 'string' &&
           roomName.length >= 1 &&
           roomName.length <= 50 &&
           /^[a-zA-Z0-9-_]+$/.test(roomName);
  }

  validateMessageContent(content) {
    return typeof content === 'string' &&
           content.trim().length > 0 &&
           content.length <= 1000;
  }

  // Solution: Helper methods
  isConnected() {
    return this.socket && this.socket.connected && this.connectionState === 'connected';
  }

  getConnectionState() {
    return this.connectionState;
  }

  getCurrentRoom() {
    return this.currentRoom;
  }

  getUser() {
    return this.user;
  }

  // Solution: Process queued messages
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { content, type, resolve, reject } = this.messageQueue.shift();
      this.sendMessage(content, type).then(resolve).catch(reject);
    }
  }

  // Solution: Cleanup
  disconnect() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.connectionState = 'disconnected';
    this.currentRoom = null;
    this.user = null;
    this.messageQueue = [];
    this.eventListeners.clear();
  }
}

// Solution: Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatClient;
} else if (typeof window !== 'undefined') {
  window.ChatClient = ChatClient;
}`,
      'message-validator.js': `const DOMPurify = require('isomorphic-dompurify');
const Filter = require('bad-words');

class MessageValidator {
  constructor() {
    this.profanityFilter = new Filter();
    this.maxMessageLength = 1000;
    this.maxRoomNameLength = 50;
    this.allowedMessageTypes = ['text', 'image', 'file', 'emoji'];
  }

  // Solution: Comprehensive message validation
  validateMessage(messageData) {
    const errors = [];

    // Check required fields
    if (!messageData) {
      return { isValid: false, error: 'Message data is required' };
    }

    if (!messageData.content || typeof messageData.content !== 'string') {
      errors.push('Message content is required and must be a string');
    }

    // Validate content length
    if (messageData.content && messageData.content.length > this.maxMessageLength) {
      errors.push(\`Message content must be less than \${this.maxMessageLength} characters\`);
    }

    // Validate content is not empty after trimming
    if (messageData.content && messageData.content.trim().length === 0) {
      errors.push('Message content cannot be empty');
    }

    // Validate message type
    if (messageData.type && !this.allowedMessageTypes.includes(messageData.type)) {
      errors.push(\`Invalid message type. Allowed types: \${this.allowedMessageTypes.join(', ')}\`);
    }

    // Check for spam patterns
    if (messageData.content && this.isSpam(messageData.content)) {
      errors.push('Message appears to be spam');
    }

    // Check for excessive repetition
    if (messageData.content && this.hasExcessiveRepetition(messageData.content)) {
      errors.push('Message contains excessive repetition');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : null,
      errors
    };
  }

  // Solution: Room name validation
  validateRoomName(roomName) {
    if (!roomName || typeof roomName !== 'string') {
      return false;
    }

    // Check length
    if (roomName.length < 1 || roomName.length > this.maxRoomNameLength) {
      return false;
    }

    // Check allowed characters (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9-_]+$/.test(roomName)) {
      return false;
    }

    // Check for profanity
    if (this.profanityFilter.isProfane(roomName)) {
      return false;
    }

    return true;
  }

  // Solution: Content sanitization
  sanitizeContent(content) {
    if (!content || typeof content !== 'string') {
      return '';
    }

    // Remove excessive whitespace
    let sanitized = content.trim().replace(/\\s+/g, ' ');

    // Remove potentially dangerous HTML
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });

    // Filter profanity (optional - can be configured)
    if (process.env.FILTER_PROFANITY === 'true') {
      sanitized = this.profanityFilter.clean(sanitized);
    }

    return sanitized;
  }

  // Solution: Spam detection
  isSpam(content) {
    const spamPatterns = [
      /http[s]?:\\/\\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g, // URLs
      /\\b(?:buy|sell|cheap|free|money|cash|prize|winner|congratulations)\\b/gi, // Spam keywords
      /[A-Z]{5,}/g, // Excessive caps
      /[!]{3,}/g, // Excessive exclamation marks
      /[?]{3,}/g, // Excessive question marks
    ];

    return spamPatterns.some(pattern => pattern.test(content));
  }

  // Solution: Repetition detection
  hasExcessiveRepetition(content) {
    // Check for repeated characters
    if (/(..).*\\1.*\\1.*\\1/.test(content)) {
      return true;
    }

    // Check for repeated words
    const words = content.toLowerCase().split(/\\s+/);
    const wordCount = {};

    for (const word of words) {
      if (word.length > 2) { // Only check words longer than 2 characters
        wordCount[word] = (wordCount[word] || 0) + 1;
        if (wordCount[word] > 3) { // More than 3 repetitions
          return true;
        }
      }
    }

    return false;
  }

  // Solution: Rate limiting validation
  validateRateLimit(userId, messageHistory, windowMs = 60000, maxMessages = 30) {
    const now = Date.now();
    const windowStart = now - windowMs;

    const recentMessages = messageHistory.filter(msg =>
      msg.userId === userId && msg.timestamp > windowStart
    );

    return recentMessages.length < maxMessages;
  }

  // Solution: File validation (for file uploads)
  validateFile(fileData) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!fileData || !fileData.type || !fileData.size) {
      return { isValid: false, error: 'Invalid file data' };
    }

    if (!allowedTypes.includes(fileData.type)) {
      return {
        isValid: false,
        error: \`File type not allowed. Allowed types: \${allowedTypes.join(', ')}\`
      };
    }

    if (fileData.size > maxFileSize) {
      return {
        isValid: false,
        error: \`File size too large. Maximum size: \${maxFileSize / 1024 / 1024}MB\`
      };
    }

    return { isValid: true };
  }

  // Solution: User data validation
  validateUserData(userData) {
    const errors = [];

    if (!userData || typeof userData !== 'object') {
      return { isValid: false, error: 'User data is required' };
    }

    if (!userData.name || typeof userData.name !== 'string') {
      errors.push('User name is required');
    } else if (userData.name.length < 2 || userData.name.length > 50) {
      errors.push('User name must be between 2 and 50 characters');
    } else if (this.profanityFilter.isProfane(userData.name)) {
      errors.push('User name contains inappropriate content');
    }

    if (userData.avatar && typeof userData.avatar !== 'string') {
      errors.push('User avatar must be a string URL');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : null,
      errors
    };
  }
}

module.exports = MessageValidator;`
    },
    testCases: [
      'Socket.IO connections should be properly authenticated',
      'Messages should be validated and sanitized',
      'Room management should handle joins and leaves correctly',
      'Rate limiting should prevent message spam'
    ],
    debuggingSteps: [
      'Test Socket.IO connection and authentication flow',
      'Verify message validation and sanitization',
      'Check room state management and cleanup',
      'Test rate limiting and error handling'
    ],
    commonMistakes: [
      'Missing authentication for Socket.IO connections',
      'No input validation or sanitization',
      'Poor room state management',
      'Missing rate limiting and error handling'
    ],
    productionImpact: 'Security vulnerabilities, spam messages, memory leaks, poor user experience',
    preventionTips: [
      'Always authenticate Socket.IO connections',
      'Implement comprehensive input validation',
      'Use proper state management for rooms and users',
      'Add rate limiting and comprehensive error handling'
    ]
  },

  // ===== ADVANCED API SECURITY ISSUES (5 challenges) =====

  {
    id: 'node-oauth2-implementation-flaws',
    title: 'OAuth2 Implementation Security Flaws',
    description: 'OAuth2 authentication implementation with multiple security vulnerabilities',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '35 min',
    xpReward: 200,
    tags: ['Node.js', 'OAuth2', 'Security', 'Authentication'],
    rootCause: 'Improper OAuth2 flow implementation and missing security validations',
    category: 'Security',
    files: {
      'oauth-server.js': `const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// BUG: Storing tokens in memory - not persistent!
const authCodes = new Map();
const accessTokens = new Map();
const refreshTokens = new Map();

// OAuth2 Authorization endpoint
app.get('/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, response_type, state } = req.query;

  // BUG: Not validating client_id!
  // BUG: Not validating redirect_uri!
  // BUG: Not checking response_type!

  const authCode = crypto.randomBytes(32).toString('hex');
  authCodes.set(authCode, {
    client_id,
    redirect_uri,
    user_id: 'user123', // Simulated user
    expires_at: Date.now() + 600000 // 10 minutes
  });

  // BUG: Not validating state parameter for CSRF protection!
  res.redirect(\`\${redirect_uri}?code=\${authCode}&state=\${state}\`);
});

// OAuth2 Token endpoint
app.post('/oauth/token', (req, res) => {
  const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;

  // BUG: Not validating grant_type!
  // BUG: Not validating client credentials!

  const authCodeData = authCodes.get(code);
  if (!authCodeData) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // BUG: Not checking if auth code is expired!
  // BUG: Not validating redirect_uri matches!

  authCodes.delete(code); // Use auth code only once

  const accessToken = jwt.sign(
    { user_id: authCodeData.user_id, client_id },
    'secret', // BUG: Hardcoded secret!
    { expiresIn: '1h' }
  );

  const refreshToken = crypto.randomBytes(32).toString('hex');

  accessTokens.set(accessToken, {
    user_id: authCodeData.user_id,
    client_id,
    expires_at: Date.now() + 3600000
  });

  refreshTokens.set(refreshToken, {
    user_id: authCodeData.user_id,
    client_id
  });

  res.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: refreshToken
  });
});`,
      'client-config.js': `// BUG: Client configuration not properly secured!
const clients = {
  'client123': {
    secret: 'secret123', // BUG: Weak secret!
    redirect_uris: ['http://localhost:3000/callback'] // BUG: Only HTTP allowed!
  }
};

module.exports = clients;`
    },
    hints: [
      'Validate all OAuth2 parameters properly',
      'Implement proper client authentication',
      'Add CSRF protection with state parameter',
      'Use secure token storage and strong secrets'
    ],
    solution: {
      'oauth-server.js': `const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const clients = require('./client-config');
const app = express();

app.use(express.json());

// Solution: Rate limiting for OAuth endpoints
const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many OAuth requests from this IP'
});

app.use('/oauth', oauthLimiter);

// Solution: Use database or Redis for production
const authCodes = new Map();
const accessTokens = new Map();
const refreshTokens = new Map();

// Solution: Validate client and redirect URI
function validateClient(clientId, redirectUri) {
  const client = clients[clientId];
  if (!client) return false;

  // Check if redirect URI is in allowed list
  return client.redirect_uris.includes(redirectUri);
}

// Solution: Generate cryptographically secure tokens
function generateSecureToken() {
  return crypto.randomBytes(32).toString('base64url');
}

// OAuth2 Authorization endpoint
app.get('/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, response_type, state, scope } = req.query;

  // Solution: Validate all required parameters
  if (!client_id || !redirect_uri || !response_type || !state) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'Missing required parameters'
    });
  }

  // Solution: Validate response_type
  if (response_type !== 'code') {
    return res.status(400).json({
      error: 'unsupported_response_type',
      error_description: 'Only authorization code flow is supported'
    });
  }

  // Solution: Validate client and redirect URI
  if (!validateClient(client_id, redirect_uri)) {
    return res.status(400).json({
      error: 'invalid_client',
      error_description: 'Invalid client or redirect URI'
    });
  }

  // Solution: Validate state parameter length for CSRF protection
  if (!state || state.length < 16) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'State parameter must be at least 16 characters'
    });
  }

  const authCode = generateSecureToken();
  authCodes.set(authCode, {
    client_id,
    redirect_uri,
    user_id: 'user123', // In production, get from authenticated session
    scope: scope || 'read',
    expires_at: Date.now() + 600000, // 10 minutes
    state
  });

  // Solution: Proper redirect with state validation
  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set('code', authCode);
  redirectUrl.searchParams.set('state', state);

  res.redirect(redirectUrl.toString());
});

module.exports = app;`
    },
    testCases: [
      'Invalid client credentials should be rejected',
      'Expired authorization codes should not work',
      'Redirect URI validation should prevent attacks',
      'State parameter should prevent CSRF attacks'
    ],
    debuggingSteps: [
      'Test OAuth2 flow with invalid parameters',
      'Verify client credential validation',
      'Check authorization code expiration handling',
      'Test CSRF protection with state parameter'
    ],
    commonMistakes: [
      'Not validating OAuth2 parameters properly',
      'Using weak or hardcoded secrets',
      'Missing CSRF protection',
      'Improper token storage and validation'
    ],
    productionImpact: 'Security vulnerabilities, unauthorized access, token theft, CSRF attacks',
    preventionTips: [
      'Validate all OAuth2 parameters thoroughly',
      'Use strong, hashed client secrets',
      'Implement proper CSRF protection',
      'Use secure token storage and generation'
    ]
  }
];

// Export total count for verification
export const nodeDebugChallengesCount = nodeDebugChallenges.length;
