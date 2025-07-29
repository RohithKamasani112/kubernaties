// Angular Debugging Challenges - 55 Comprehensive Scenarios
// Production-Ready Debugging Skills for Angular Developers

import { DebugChallenge } from './debugPlatformComplete';

export const angularDebugChallenges: DebugChallenge[] = [
  // ===== CHANGE DETECTION ISSUES (12 challenges) =====
  
  // 1. ExpressionChangedAfterItHasBeenCheckedError
  {
    id: 'angular-expression-changed-error',
    title: 'ExpressionChangedAfterItHasBeenCheckedError',
    description: 'Common Angular error when bound value changes after change detection',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 120,
    tags: ['Angular', 'Change Detection', 'Lifecycle', 'Error'],
    rootCause: 'Value updated in lifecycle hook after change detection has run',
    category: 'Change Detection',
    files: {
      'app.component.ts': `import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <h1>{{title}}</h1>
      <app-child [message]="message"></app-child>
    </div>
  \`
})
export class AppComponent implements AfterViewInit {
  title = 'My App';
  message = 'Initial message';

  ngAfterViewInit() {
    // BUG: Changing bound value after view has been checked!
    setTimeout(() => {
      this.message = 'Updated message';
    }, 0);
  }
}`,
      'child.component.ts': `import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-child',
  template: \`
    <div>
      <p>{{message}}</p>
      <p>Timestamp: {{timestamp}}</p>
    </div>
  \`
})
export class ChildComponent implements AfterViewInit {
  @Input() message: string = '';
  timestamp: string = '';

  ngAfterViewInit() {
    // BUG: This also causes the error!
    this.timestamp = new Date().toISOString();
  }
}`
    },
    hints: [
      'Change detection has already run when AfterViewInit is called',
      'Use ChangeDetectorRef.detectChanges() to manually trigger detection',
      'Move updates to ngAfterViewChecked or use async operations',
      'Consider using OnPush change detection strategy'
    ],
    solution: {
      'app.component.ts': `import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <h1>{{title}}</h1>
      <app-child [message]="message"></app-child>
    </div>
  \`
})
export class AppComponent implements AfterViewInit {
  title = 'My App';
  message = 'Initial message';

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Solution 1: Use setTimeout to defer the update
    setTimeout(() => {
      this.message = 'Updated message';
    }, 0);

    // Solution 2: Manually trigger change detection
    // this.message = 'Updated message';
    // this.cdr.detectChanges();
  }
}`,
      'child.component.ts': `import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-child',
  template: \`
    <div>
      <p>{{message}}</p>
      <p>Timestamp: {{timestamp}}</p>
    </div>
  \`
})
export class ChildComponent implements AfterViewInit {
  @Input() message: string = '';
  timestamp: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Solution: Manually trigger change detection after update
    this.timestamp = new Date().toISOString();
    this.cdr.detectChanges();
  }
}`
    },
    testCases: [
      'Component should render without console errors',
      'Message should update correctly',
      'Timestamp should display properly',
      'No ExpressionChangedAfterItHasBeenCheckedError in console'
    ],
    debuggingSteps: [
      'Check browser console for Angular errors',
      'Use Angular DevTools to inspect change detection cycles',
      'Add console.log in lifecycle hooks to understand execution order',
      'Test with production build to see if error persists'
    ],
    commonMistakes: [
      'Updating bound values in AfterViewInit without manual detection',
      'Not understanding Angular\'s change detection cycle',
      'Forgetting to inject ChangeDetectorRef when needed'
    ],
    productionImpact: 'Application may crash or behave unpredictably in production builds',
    preventionTips: [
      'Use setTimeout for async updates in lifecycle hooks',
      'Inject and use ChangeDetectorRef when manual detection is needed',
      'Consider OnPush change detection strategy for better performance'
    ]
  },

  // 2. OnPush Component Not Updating
  {
    id: 'angular-onpush-not-updating',
    title: 'OnPush Component Not Updating',
    description: 'Component with OnPush strategy doesn\'t update when data changes',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['Angular', 'OnPush', 'Change Detection', 'Performance'],
    rootCause: 'OnPush components only update on input reference changes or events',
    category: 'Change Detection',
    files: {
      'user-list.component.ts': `import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  template: \`
    <div>
      <h3>Users ({{users.length}})</h3>
      <div *ngFor="let user of users">
        <p>{{user.name}} - {{user.email}}</p>
      </div>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() users: User[] = [];
}`,
      'app.component.ts': `import { Component } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <button (click)="addUser()">Add User</button>
      <button (click)="updateFirstUser()">Update First User</button>
      <app-user-list [users]="users"></app-user-list>
    </div>
  \`
})
export class AppComponent {
  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  addUser() {
    // BUG: Mutating array directly doesn't trigger OnPush update!
    this.users.push({
      id: this.users.length + 1,
      name: \`User \${this.users.length + 1}\`,
      email: \`user\${this.users.length + 1}@example.com\`
    });
  }

  updateFirstUser() {
    // BUG: Mutating object directly doesn't trigger OnPush update!
    this.users[0].name = 'Updated John Doe';
    this.users[0].email = 'updated.john@example.com';
  }
}`
    },
    hints: [
      'OnPush components only update when input references change',
      'Mutating arrays/objects directly doesn\'t create new references',
      'Use immutable update patterns with spread operator',
      'Consider using ChangeDetectorRef.markForCheck() when needed'
    ],
    solution: {
      'user-list.component.ts': `import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  template: \`
    <div>
      <h3>Users ({{users.length}})</h3>
      <div *ngFor="let user of users; trackBy: trackByUserId">
        <p>{{user.name}} - {{user.email}}</p>
      </div>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() users: User[] = [];

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}`,
      'app.component.ts': `import { Component } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <button (click)="addUser()">Add User</button>
      <button (click)="updateFirstUser()">Update First User</button>
      <app-user-list [users]="users"></app-user-list>
    </div>
  \`
})
export class AppComponent {
  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  addUser() {
    // Solution: Create new array reference
    this.users = [
      ...this.users,
      {
        id: this.users.length + 1,
        name: \`User \${this.users.length + 1}\`,
        email: \`user\${this.users.length + 1}@example.com\`
      }
    ];
  }

  updateFirstUser() {
    // Solution: Create new array with updated object
    this.users = this.users.map((user, index) => 
      index === 0 
        ? { ...user, name: 'Updated John Doe', email: 'updated.john@example.com' }
        : user
    );
  }
}`
    },
    testCases: [
      'Click "Add User" and verify new user appears',
      'Click "Update First User" and verify first user updates',
      'Check that user count updates correctly',
      'Verify OnPush optimization is working'
    ],
    debuggingSteps: [
      'Use Angular DevTools to monitor change detection cycles',
      'Add console.log in component to see when it updates',
      'Check if input references are changing',
      'Use trackBy functions for better performance'
    ],
    commonMistakes: [
      'Mutating arrays/objects directly with OnPush',
      'Not understanding reference vs value equality',
      'Forgetting to use immutable update patterns'
    ],
    productionImpact: 'UI may not reflect data changes, leading to stale or incorrect displays',
    preventionTips: [
      'Always use immutable update patterns with OnPush',
      'Use spread operator or Object.assign for updates',
      'Consider using state management libraries like NgRx'
    ]
  },

  // 3. Zone.js Issues with Third-Party Libraries
  {
    id: 'angular-zone-third-party',
    title: 'Zone.js Issues with Third-Party Libraries',
    description: 'UI doesn\'t update after third-party library operations complete',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '22 min',
    xpReward: 160,
    tags: ['Angular', 'Zone.js', 'Third-Party', 'Change Detection'],
    rootCause: 'Third-party libraries run outside Angular\'s zone',
    category: 'Change Detection',
    files: {
      'map.component.ts': `import { Component, OnInit, NgZone } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map',
  template: \`
    <div>
      <h3>Google Maps Integration</h3>
      <div id="map" style="height: 400px; width: 100%;"></div>
      <div>
        <p>Selected Location: {{selectedLocation}}</p>
        <p>Marker Count: {{markerCount}}</p>
      </div>
    </div>
  \`
})
export class MapComponent implements OnInit {
  selectedLocation = 'None';
  markerCount = 0;
  private map: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 13
    };

    this.map = new google.maps.Map(
      document.getElementById('map'),
      mapOptions
    );

    // BUG: Google Maps events run outside Angular zone!
    this.map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // This update won't trigger change detection!
      this.selectedLocation = \`\${lat.toFixed(4)}, \${lng.toFixed(4)}\`;
      
      // Add marker
      new google.maps.Marker({
        position: { lat, lng },
        map: this.map
      });
      
      // This also won't update the UI!
      this.markerCount++;
    });
  }
}`
    },
    hints: [
      'Third-party libraries often run outside Angular\'s zone',
      'Use NgZone.run() to execute code inside Angular zone',
      'Zone.js patches many async operations but not all',
      'Consider using runOutsideAngular() for performance-critical operations'
    ],
    solution: {
      'map.component.ts': `import { Component, OnInit, NgZone } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map',
  template: \`
    <div>
      <h3>Google Maps Integration</h3>
      <div id="map" style="height: 400px; width: 100%;"></div>
      <div>
        <p>Selected Location: {{selectedLocation}}</p>
        <p>Marker Count: {{markerCount}}</p>
        <button (click)="clearMarkers()">Clear Markers</button>
      </div>
    </div>
  \`
})
export class MapComponent implements OnInit {
  selectedLocation = 'None';
  markerCount = 0;
  private map: any;
  private markers: any[] = [];

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 13
    };

    // Run map initialization outside Angular zone for better performance
    this.ngZone.runOutsideAngular(() => {
      this.map = new google.maps.Map(
        document.getElementById('map'),
        mapOptions
      );

      // Solution: Wrap callback in ngZone.run()
      this.map.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        // Run inside Angular zone to trigger change detection
        this.ngZone.run(() => {
          this.selectedLocation = \`\${lat.toFixed(4)}, \${lng.toFixed(4)}\`;
          this.markerCount++;
        });
        
        // Create marker outside zone (no need for change detection)
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: this.map
        });
        
        this.markers.push(marker);
      });
    });
  }

  clearMarkers() {
    // Clear markers from map
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    
    // Reset state
    this.markerCount = 0;
    this.selectedLocation = 'None';
  }
}`
    },
    testCases: [
      'Click on map and verify location updates in UI',
      'Check that marker count increments correctly',
      'Test clear markers functionality',
      'Verify map performance is not degraded'
    ],
    debuggingSteps: [
      'Use Angular DevTools to monitor zone patches',
      'Add console.log to see if callbacks are executed',
      'Check if change detection is triggered after third-party events',
      'Use Zone.js debugging tools'
    ],
    commonMistakes: [
      'Not wrapping third-party callbacks in NgZone.run()',
      'Running all operations inside Angular zone (performance impact)',
      'Not understanding which operations are patched by Zone.js'
    ],
    productionImpact: 'UI may not reflect changes from third-party library interactions',
    preventionTips: [
      'Use NgZone.run() for third-party callbacks that update Angular state',
      'Use runOutsideAngular() for performance-critical operations',
      'Test third-party integrations thoroughly'
    ]
  },

  // 4-10: More Change Detection Issues
  {
    id: 'angular-zone-runoutsideangular',
    title: 'Zone.js runOutsideAngular Performance Issues',
    description: 'Improper use of runOutsideAngular causing performance problems and missed updates',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 170,
    tags: ['Angular', 'Zone.js', 'Performance', 'Change Detection'],
    rootCause: 'Misunderstanding when to use runOutsideAngular and how to trigger updates',
    category: 'Change Detection',
    files: {
      'performance-chart.component.ts': `import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

@Component({
  selector: 'app-performance-chart',
  template: \`
    <div>
      <h3>Real-time Performance Chart</h3>
      <canvas #chart width="800" height="400"></canvas>
      <div>
        <p>Data Points: {{dataPoints.length}}</p>
        <p>Last Update: {{lastUpdate}}</p>
        <button (click)="toggleUpdates()">
          {{isUpdating ? 'Stop' : 'Start'}} Updates
        </button>
      </div>
    </div>
  \`
})
export class PerformanceChartComponent implements OnInit, OnDestroy {
  dataPoints: number[] = [];
  lastUpdate = '';
  isUpdating = false;
  private intervalId: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.startUpdates();
  }

  ngOnDestroy() {
    this.stopUpdates();
  }

  startUpdates() {
    this.isUpdating = true;

    // BUG: Running expensive operations inside Angular zone!
    this.intervalId = setInterval(() => {
      // Simulate expensive data processing
      for (let i = 0; i < 10000; i++) {
        Math.random() * Math.random();
      }

      // Add new data point
      this.dataPoints.push(Math.random() * 100);

      // Keep only last 100 points
      if (this.dataPoints.length > 100) {
        this.dataPoints.shift();
      }

      // BUG: This update won't be reflected in UI!
      this.lastUpdate = new Date().toLocaleTimeString();

      // Expensive canvas drawing
      this.drawChart();
    }, 100);
  }

  stopUpdates() {
    this.isUpdating = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleUpdates() {
    if (this.isUpdating) {
      this.stopUpdates();
    } else {
      this.startUpdates();
    }
  }

  private drawChart() {
    // BUG: Heavy DOM manipulation inside zone
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw data points
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    this.dataPoints.forEach((point, index) => {
      const x = (index / this.dataPoints.length) * canvas.width;
      const y = canvas.height - (point / 100) * canvas.height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }
}`
    },
    hints: [
      'Use runOutsideAngular for performance-critical operations',
      'Use ngZone.run() to trigger change detection when needed',
      'Separate data processing from UI updates',
      'Consider using requestAnimationFrame for smooth animations'
    ],
    solution: {
      'performance-chart.component.ts': `import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-performance-chart',
  template: \`
    <div>
      <h3>Real-time Performance Chart</h3>
      <canvas #chart width="800" height="400"></canvas>
      <div>
        <p>Data Points: {{dataPoints.length}}</p>
        <p>Last Update: {{lastUpdate}}</p>
        <p>FPS: {{fps}}</p>
        <button (click)="toggleUpdates()">
          {{isUpdating ? 'Stop' : 'Start'}} Updates
        </button>
      </div>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart', { static: true }) chartRef!: ElementRef<HTMLCanvasElement>;

  dataPoints: number[] = [];
  lastUpdate = '';
  fps = 0;
  isUpdating = false;

  private intervalId: any;
  private animationId: any;
  private lastFrameTime = 0;
  private frameCount = 0;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.startUpdates();
  }

  ngOnDestroy() {
    this.stopUpdates();
  }

  startUpdates() {
    this.isUpdating = true;

    // Solution: Run data processing outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        // Expensive data processing outside zone
        for (let i = 0; i < 10000; i++) {
          Math.random() * Math.random();
        }

        // Add new data point
        this.dataPoints.push(Math.random() * 100);

        // Keep only last 100 points
        if (this.dataPoints.length > 100) {
          this.dataPoints.shift();
        }

        // Update UI-related data inside zone
        this.ngZone.run(() => {
          this.lastUpdate = new Date().toLocaleTimeString();
          this.cdr.markForCheck(); // Trigger change detection for OnPush
        });

        // Draw chart outside zone for better performance
        this.drawChart();
      }, 100);

      // Start FPS monitoring
      this.startFPSMonitoring();
    });
  }

  stopUpdates() {
    this.isUpdating = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  toggleUpdates() {
    if (this.isUpdating) {
      this.stopUpdates();
    } else {
      this.startUpdates();
    }
  }

  private startFPSMonitoring() {
    const updateFPS = (currentTime: number) => {
      if (this.lastFrameTime === 0) {
        this.lastFrameTime = currentTime;
      }

      const deltaTime = currentTime - this.lastFrameTime;
      this.frameCount++;

      // Update FPS every second
      if (deltaTime >= 1000) {
        const currentFPS = Math.round((this.frameCount * 1000) / deltaTime);

        // Update FPS in Angular zone
        this.ngZone.run(() => {
          this.fps = currentFPS;
          this.cdr.markForCheck();
        });

        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }

      if (this.isUpdating) {
        this.animationId = requestAnimationFrame(updateFPS);
      }
    };

    this.animationId = requestAnimationFrame(updateFPS);
  }

  private drawChart() {
    const canvas = this.chartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    this.drawGrid(ctx, canvas);

    // Draw data points
    this.drawDataLine(ctx, canvas);

    // Draw labels
    this.drawLabels(ctx, canvas);
  }

  private drawGrid(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  private drawDataLine(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    if (this.dataPoints.length < 2) return;

    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    this.dataPoints.forEach((point, index) => {
      const x = (index / (this.dataPoints.length - 1)) * canvas.width;
      const y = canvas.height - (point / 100) * canvas.height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#007bff';
    this.dataPoints.forEach((point, index) => {
      const x = (index / (this.dataPoints.length - 1)) * canvas.width;
      const y = canvas.height - (point / 100) * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  private drawLabels(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';

    // Y-axis labels
    for (let i = 0; i <= 10; i++) {
      const value = (10 - i) * 10;
      const y = (i / 10) * canvas.height + 4;
      ctx.fillText(value.toString(), 5, y);
    }

    // X-axis labels (time)
    const now = Date.now();
    for (let i = 0; i <= 5; i++) {
      const timeOffset = (5 - i) * 2; // 2 seconds per division
      const time = new Date(now - timeOffset * 1000);
      const x = (i / 5) * canvas.width;
      const y = canvas.height - 5;

      ctx.fillText(
        time.toLocaleTimeString().split(':').slice(1).join(':'),
        x,
        y
      );
    }
  }
}`
    },
    testCases: [
      'Chart should update smoothly without performance issues',
      'FPS counter should show good performance',
      'UI updates should reflect data changes',
      'Canvas drawing should not block UI interactions'
    ],
    debuggingSteps: [
      'Use Angular DevTools to monitor change detection cycles',
      'Check browser performance tab for frame rates',
      'Monitor CPU usage during updates',
      'Verify runOutsideAngular is working correctly'
    ],
    commonMistakes: [
      'Running expensive operations inside Angular zone',
      'Not using runOutsideAngular for performance-critical code',
      'Forgetting to trigger change detection after runOutsideAngular',
      'Not using OnPush change detection strategy'
    ],
    productionImpact: 'Poor performance, UI freezing, high CPU usage, bad user experience',
    preventionTips: [
      'Use runOutsideAngular for expensive operations',
      'Use OnPush change detection strategy',
      'Monitor performance with browser dev tools',
      'Separate data processing from UI updates'
    ]
  },

  {
    id: 'angular-async-pipe-issues',
    title: 'Async Pipe Memory Leaks and Subscription Issues',
    description: 'Problems with async pipe causing memory leaks and multiple subscriptions',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['Angular', 'Async Pipe', 'Observables', 'Memory Leaks'],
    rootCause: 'Improper use of async pipe and manual subscriptions',
    category: 'Change Detection',
    files: {
      'user-profile.component.ts': `import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
  lastActive: Date;
}

@Component({
  selector: 'app-user-profile',
  template: \`
    <div>
      <h3>User Profile</h3>

      <!-- BUG: Multiple async pipes on same observable! -->
      <div *ngIf="user$ | async as user">
        <h4>{{(user$ | async)?.name}}</h4>
        <p>Email: {{(user$ | async)?.email}}</p>
        <p>Last Active: {{(user$ | async)?.lastActive | date}}</p>
      </div>

      <!-- BUG: Async pipe with complex expression -->
      <div>
        <p>Status: {{(user$ | async)?.lastActive ? 'Online' : 'Offline'}}</p>
        <p>Activity: {{getActivityStatus(user$ | async)}}</p>
      </div>

      <!-- BUG: Manual subscription alongside async pipe -->
      <div>
        <p>Manual subscription result: {{manualUserData?.name}}</p>
      </div>

      <button (click)="refreshUser()">Refresh User</button>
    </div>
  \`
})
export class UserProfileComponent implements OnInit {
  user$: Observable<User>;
  manualUserData: User | null = null;

  private userIdSubject = new BehaviorSubject<number>(1);

  constructor() {
    // BUG: Creating observable in constructor
    this.user$ = this.userIdSubject.pipe(
      switchMap(id => this.getUserData(id))
    );
  }

  ngOnInit() {
    // BUG: Manual subscription when async pipe is already used
    this.user$.subscribe(user => {
      this.manualUserData = user;
      console.log('User updated:', user);
    });
  }

  refreshUser() {
    // BUG: Creating new observable reference
    this.user$ = this.getUserData(Math.floor(Math.random() * 10) + 1);
  }

  getActivityStatus(user: User | null): string {
    if (!user) return 'Unknown';

    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);

    if (diffMinutes < 5) return 'Active';
    if (diffMinutes < 30) return 'Away';
    return 'Inactive';
  }

  private getUserData(id: number): Observable<User> {
    // Simulate API call with interval updates
    return interval(1000).pipe(
      map(() => ({
        id,
        name: \`User \${id}\`,
        email: \`user\${id}@example.com\`,
        lastActive: new Date(Date.now() - Math.random() * 3600000)
      }))
    );
  }
}`
    },
    hints: [
      'Use async pipe with alias to avoid multiple subscriptions',
      'Implement OnDestroy to clean up manual subscriptions',
      'Avoid creating observables in templates',
      'Use trackBy functions with async pipe in ngFor'
    ],
    solution: {
      'user-profile.component.ts': `import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  interval,
  Subject,
  combineLatest
} from 'rxjs';
import {
  map,
  switchMap,
  takeUntil,
  shareReplay,
  distinctUntilChanged
} from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
  lastActive: Date;
}

interface UserWithActivity extends User {
  activityStatus: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-user-profile',
  template: \`
    <div>
      <h3>User Profile</h3>

      <!-- Solution: Single async pipe with alias -->
      <div *ngIf="userWithActivity$ | async as userActivity">
        <h4>{{userActivity.name}}</h4>
        <p>Email: {{userActivity.email}}</p>
        <p>Last Active: {{userActivity.lastActive | date:'medium'}}</p>
        <p>Status: {{userActivity.isOnline ? 'Online' : 'Offline'}}</p>
        <p>Activity: {{userActivity.activityStatus}}</p>
      </div>

      <!-- Loading state -->
      <div *ngIf="!(userWithActivity$ | async)">
        Loading user data...
      </div>

      <!-- Error handling -->
      <div *ngIf="error$ | async as error" class="error">
        Error: {{error}}
      </div>

      <div>
        <button (click)="refreshUser()">Refresh User</button>
        <button (click)="loadRandomUser()">Load Random User</button>
      </div>

      <!-- Debug info -->
      <div class="debug-info">
        <p>Current User ID: {{currentUserId$ | async}}</p>
        <p>Subscription Count: {{subscriptionCount}}</p>
      </div>
    </div>
  \`,
  styles: [\`
    .error {
      color: red;
      padding: 10px;
      background-color: #ffe6e6;
      border-radius: 4px;
      margin: 10px 0;
    }

    .debug-info {
      margin-top: 20px;
      padding: 10px;
      background-color: #f0f0f0;
      border-radius: 4px;
      font-size: 12px;
    }
  \`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // Observables for template
  userWithActivity$: Observable<UserWithActivity>;
  currentUserId$: Observable<number>;
  error$: Observable<string | null>;

  // Subjects for state management
  private userIdSubject = new BehaviorSubject<number>(1);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private destroy$ = new Subject<void>();

  // Debug info
  subscriptionCount = 0;

  constructor() {
    this.currentUserId$ = this.userIdSubject.asObservable();
    this.error$ = this.errorSubject.asObservable();

    // Solution: Create enhanced user observable with proper error handling
    this.userWithActivity$ = this.userIdSubject.pipe(
      distinctUntilChanged(),
      switchMap(id => this.getUserDataWithRetry(id)),
      map(user => this.enhanceUserWithActivity(user)),
      shareReplay(1), // Cache latest value for multiple subscribers
      takeUntil(this.destroy$)
    );
  }

  ngOnInit() {
    // Solution: Only use async pipe, no manual subscriptions
    // If you need side effects, use tap operator in the observable chain

    // Optional: Subscribe only for logging/analytics
    this.userWithActivity$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (user) => {
        console.log('User updated:', user);
        this.subscriptionCount++;
      },
      error: (error) => {
        console.error('User data error:', error);
        this.errorSubject.next(error.message);
      }
    });
  }

  ngOnDestroy() {
    // Solution: Proper cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshUser() {
    // Solution: Update subject instead of creating new observable
    const currentId = this.userIdSubject.value;
    this.errorSubject.next(null);

    // Force refresh by emitting same ID
    this.userIdSubject.next(currentId);
  }

  loadRandomUser() {
    const randomId = Math.floor(Math.random() * 10) + 1;
    this.errorSubject.next(null);
    this.userIdSubject.next(randomId);
  }

  private getUserDataWithRetry(id: number): Observable<User> {
    return new Observable<User>(subscriber => {
      let attempt = 0;
      const maxAttempts = 3;

      const tryFetch = () => {
        attempt++;

        // Simulate API call that might fail
        const shouldFail = Math.random() < 0.2; // 20% chance of failure

        if (shouldFail && attempt < maxAttempts) {
          console.log(\`Attempt \${attempt} failed, retrying...\`);
          setTimeout(tryFetch, 1000);
          return;
        }

        if (shouldFail) {
          subscriber.error(new Error(\`Failed to load user \${id} after \${maxAttempts} attempts\`));
          return;
        }

        // Success - emit user data
        const user: User = {
          id,
          name: \`User \${id}\`,
          email: \`user\${id}@example.com\`,
          lastActive: new Date(Date.now() - Math.random() * 3600000)
        };

        subscriber.next(user);

        // Set up periodic updates
        const updateInterval = setInterval(() => {
          const updatedUser: User = {
            ...user,
            lastActive: new Date(Date.now() - Math.random() * 3600000)
          };
          subscriber.next(updatedUser);
        }, 5000);

        // Cleanup on unsubscribe
        return () => {
          clearInterval(updateInterval);
        };
      };

      tryFetch();
    });
  }

  private enhanceUserWithActivity(user: User): UserWithActivity {
    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);

    let activityStatus: string;
    let isOnline: boolean;

    if (diffMinutes < 5) {
      activityStatus = 'Active';
      isOnline = true;
    } else if (diffMinutes < 30) {
      activityStatus = 'Away';
      isOnline = true;
    } else {
      activityStatus = 'Inactive';
      isOnline = false;
    }

    return {
      ...user,
      activityStatus,
      isOnline
    };
  }
}`
    },
    testCases: [
      'User data should load without multiple subscriptions',
      'Error handling should work correctly',
      'Memory should not leak when component is destroyed',
      'Refresh functionality should work properly'
    ],
    debuggingSteps: [
      'Use Angular DevTools to monitor subscriptions',
      'Check browser memory tab for leaks',
      'Verify async pipe behavior with console logs',
      'Test component destruction and cleanup'
    ],
    commonMistakes: [
      'Using multiple async pipes on same observable',
      'Manual subscriptions alongside async pipes',
      'Not implementing OnDestroy for cleanup',
      'Creating new observable references unnecessarily'
    ],
    productionImpact: 'Memory leaks, multiple API calls, poor performance, inconsistent UI state',
    preventionTips: [
      'Use async pipe with alias to avoid multiple subscriptions',
      'Implement proper cleanup with takeUntil pattern',
      'Use shareReplay for caching observable results',
      'Avoid manual subscriptions when async pipe is sufficient'
    ]
  },

  // ===== DEPENDENCY INJECTION ISSUES (8 challenges) =====

  {
    id: 'angular-circular-dependency',
    title: 'Circular Dependency Injection',
    description: 'Services have circular dependencies causing injection errors',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['Angular', 'DI', 'Circular Dependency', 'Services'],
    rootCause: 'Services depend on each other creating circular reference',
    category: 'Dependency Injection',
    files: {
      'user.service.ts': `import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private notificationService: NotificationService) {}

  createUser(userData: any) {
    // Create user logic
    const user = { id: Date.now(), ...userData };

    // BUG: This creates circular dependency!
    this.notificationService.notifyUserCreated(user);

    return user;
  }

  deleteUser(userId: number) {
    // Delete user logic
    this.notificationService.notifyUserDeleted(userId);
  }
}`,
      'notification.service.ts': `import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // BUG: Circular dependency with UserService!
  constructor(private userService: UserService) {}

  notifyUserCreated(user: any) {
    console.log('User created:', user);

    // BUG: Calling back to UserService creates circular dependency!
    const allUsers = this.userService.getAllUsers();
    console.log('Total users:', allUsers.length);
  }

  notifyUserDeleted(userId: number) {
    console.log('User deleted:', userId);

    // Another circular call
    const remainingUsers = this.userService.getAllUsers();
    console.log('Remaining users:', remainingUsers.length);
  }

  sendWelcomeEmail(userId: number) {
    // Need user data for email
    const user = this.userService.getUserById(userId);
    console.log('Sending welcome email to:', user?.email);
  }
}`
    },
    hints: [
      'Use forwardRef() for circular dependencies',
      'Consider using events/subjects instead of direct service calls',
      'Restructure services to remove circular dependencies',
      'Use dependency injection tokens for loose coupling'
    ],
    solution: {
      'user.service.ts': `import { Injectable, Inject, forwardRef } from '@angular/core';
import { Subject } from 'rxjs';

// Solution 1: Event-driven approach
export interface UserEvent {
  type: 'created' | 'deleted' | 'updated';
  userId: number;
  userData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: any[] = [];
  private userEvents$ = new Subject<UserEvent>();

  // Public observable for other services to subscribe
  get userEvents() {
    return this.userEvents$.asObservable();
  }

  createUser(userData: any) {
    const user = { id: Date.now(), ...userData };
    this.users.push(user);

    // Solution: Emit event instead of direct service call
    this.userEvents$.next({
      type: 'created',
      userId: user.id,
      userData: user
    });

    return user;
  }

  deleteUser(userId: number) {
    const index = this.users.findIndex(u => u.id === userId);
    if (index > -1) {
      this.users.splice(index, 1);

      // Emit event
      this.userEvents$.next({
        type: 'deleted',
        userId
      });
    }
  }

  getAllUsers() {
    return [...this.users];
  }

  getUserById(userId: number) {
    return this.users.find(u => u.id === userId);
  }

  updateUser(userId: number, updates: any) {
    const user = this.getUserById(userId);
    if (user) {
      Object.assign(user, updates);

      this.userEvents$.next({
        type: 'updated',
        userId,
        userData: user
      });
    }
  }
}`,
      'notification.service.ts': `import { Injectable, OnDestroy } from '@angular/core';
import { UserService, UserEvent } from './user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private destroy$ = new Subject<void>();

  // Solution: Subscribe to events instead of circular dependency
  constructor(private userService: UserService) {
    this.subscribeToUserEvents();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToUserEvents() {
    this.userService.userEvents.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      this.handleUserEvent(event);
    });
  }

  private handleUserEvent(event: UserEvent) {
    switch (event.type) {
      case 'created':
        this.notifyUserCreated(event.userData);
        break;
      case 'deleted':
        this.notifyUserDeleted(event.userId);
        break;
      case 'updated':
        this.notifyUserUpdated(event.userData);
        break;
    }
  }

  notifyUserCreated(user: any) {
    console.log('User created:', user);

    // Solution: Get data without circular dependency
    const allUsers = this.userService.getAllUsers();
    console.log('Total users:', allUsers.length);

    // Send welcome email
    this.sendWelcomeEmail(user.id);
  }

  notifyUserDeleted(userId: number) {
    console.log('User deleted:', userId);

    const remainingUsers = this.userService.getAllUsers();
    console.log('Remaining users:', remainingUsers.length);
  }

  notifyUserUpdated(user: any) {
    console.log('User updated:', user);
  }

  sendWelcomeEmail(userId: number) {
    // Get user data safely
    const user = this.userService.getUserById(userId);
    if (user?.email) {
      console.log('Sending welcome email to:', user.email);
      // Email sending logic here
    }
  }

  // Alternative solution using forwardRef (if needed)
  /*
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService
  ) {
    this.subscribeToUserEvents();
  }
  */
}`,
      'app.component.ts': `import { Component } from '@angular/core';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <h2>User Management</h2>
      <button (click)="createUser()">Create User</button>
      <button (click)="deleteUser()">Delete User</button>

      <div *ngFor="let user of users">
        <p>{{user.name}} - {{user.email}}</p>
      </div>
    </div>
  \`
})
export class AppComponent {
  users: any[] = [];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.loadUsers();
  }

  createUser() {
    const userData = {
      name: \`User \${Date.now()}\`,
      email: \`user\${Date.now()}@example.com\`
    };

    this.userService.createUser(userData);
    this.loadUsers();
  }

  deleteUser() {
    if (this.users.length > 0) {
      const lastUser = this.users[this.users.length - 1];
      this.userService.deleteUser(lastUser.id);
      this.loadUsers();
    }
  }

  private loadUsers() {
    this.users = this.userService.getAllUsers();
  }
}`
    },
    testCases: [
      'Services should inject without circular dependency errors',
      'User creation should trigger notifications',
      'User deletion should work correctly',
      'Events should be properly handled'
    ],
    debuggingSteps: [
      'Check Angular console for circular dependency warnings',
      'Use Angular DevTools to inspect service dependencies',
      'Add logging to track service initialization order',
      'Test service methods independently'
    ],
    commonMistakes: [
      'Creating circular dependencies between services',
      'Not using event-driven patterns for loose coupling',
      'Forgetting to unsubscribe from observables',
      'Improper use of forwardRef'
    ],
    productionImpact: 'Application fails to start, services cannot be injected, runtime errors',
    preventionTips: [
      'Use event-driven architecture to avoid circular dependencies',
      'Design services with single responsibility principle',
      'Use dependency injection tokens for loose coupling',
      'Consider using state management libraries for complex scenarios'
    ]
  },

  {
    id: 'angular-provider-scope-issues',
    title: 'Provider Scope and Singleton Issues',
    description: 'Services not behaving as singletons due to incorrect provider configuration',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '22 min',
    xpReward: 160,
    tags: ['Angular', 'DI', 'Providers', 'Singletons', 'Modules'],
    rootCause: 'Incorrect provider configuration causing multiple service instances',
    category: 'Dependency Injection',
    files: {
      'shared.service.ts': `import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  private data: any[] = [];
  private instanceId = Math.random().toString(36);

  constructor() {
    console.log('SharedService instance created:', this.instanceId);
  }

  addData(item: any) {
    this.data.push(item);
    console.log('Data added to instance:', this.instanceId, this.data);
  }

  getData() {
    return [...this.data];
  }

  getInstanceId() {
    return this.instanceId;
  }
}`,
      'feature-a.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared.service';
import { FeatureAComponent } from './feature-a.component';

@NgModule({
  declarations: [FeatureAComponent],
  imports: [CommonModule],
  // BUG: Providing service at module level creates separate instance!
  providers: [SharedService],
  exports: [FeatureAComponent]
})
export class FeatureAModule {}`,
      'feature-b.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared.service';
import { FeatureBComponent } from './feature-b.component';

@NgModule({
  declarations: [FeatureBComponent],
  imports: [CommonModule],
  // BUG: Another instance of SharedService!
  providers: [SharedService],
  exports: [FeatureBComponent]
})
export class FeatureBModule {}`,
      'feature-a.component.ts': `import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-feature-a',
  template: \`
    <div>
      <h3>Feature A</h3>
      <p>Service Instance: {{serviceInstanceId}}</p>
      <p>Data Count: {{dataCount}}</p>
      <button (click)="addData()">Add Data</button>
      <ul>
        <li *ngFor="let item of data">{{item}}</li>
      </ul>
    </div>
  \`
})
export class FeatureAComponent {
  serviceInstanceId: string;
  data: any[] = [];
  dataCount = 0;

  constructor(private sharedService: SharedService) {
    this.serviceInstanceId = this.sharedService.getInstanceId();
    this.loadData();
  }

  addData() {
    const item = \`Feature A Item \${Date.now()}\`;
    this.sharedService.addData(item);
    this.loadData();
  }

  private loadData() {
    this.data = this.sharedService.getData();
    this.dataCount = this.data.length;
  }
}`
    },
    hints: [
      'Use providedIn: "root" for application-wide singletons',
      'Avoid providing services in multiple modules',
      'Understand the difference between module and component providers',
      'Use forRoot() pattern for configurable services'
    ],
    solution: {
      'shared.service.ts': `import { Injectable } from '@angular/core';

// Solution: Use providedIn: 'root' for singleton
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private data: any[] = [];
  private instanceId = Math.random().toString(36);

  constructor() {
    console.log('SharedService singleton instance created:', this.instanceId);
  }

  addData(item: any) {
    this.data.push(item);
    console.log('Data added to singleton instance:', this.instanceId, this.data);
  }

  getData() {
    return [...this.data];
  }

  getInstanceId() {
    return this.instanceId;
  }

  clearData() {
    this.data = [];
  }

  getDataCount() {
    return this.data.length;
  }
}`,
      'feature-a.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureAComponent } from './feature-a.component';

@NgModule({
  declarations: [FeatureAComponent],
  imports: [CommonModule],
  // Solution: Remove provider - service is provided in root
  exports: [FeatureAComponent]
})
export class FeatureAModule {}`,
      'feature-b.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureBComponent } from './feature-b.component';

@NgModule({
  declarations: [FeatureBComponent],
  imports: [CommonModule],
  // Solution: Remove provider - service is provided in root
  exports: [FeatureBComponent]
})
export class FeatureBModule {}`,
      'configurable.service.ts': `import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';

// Configuration interface
export interface ServiceConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

// Default configuration
export const DEFAULT_CONFIG: ServiceConfig = {
  apiUrl: '/api',
  timeout: 5000,
  retries: 3
};

// Injection token for configuration
export const SERVICE_CONFIG = new InjectionToken<ServiceConfig>('SERVICE_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class ConfigurableService {
  private config: ServiceConfig;

  constructor(
    @Optional() @Inject(SERVICE_CONFIG) config: ServiceConfig | null
  ) {
    this.config = config || DEFAULT_CONFIG;
    console.log('ConfigurableService created with config:', this.config);
  }

  getConfig(): ServiceConfig {
    return { ...this.config };
  }

  makeRequest(endpoint: string): Promise<any> {
    const url = \`\${this.config.apiUrl}\${endpoint}\`;
    console.log(\`Making request to: \${url} with timeout: \${this.config.timeout}ms\`);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: 'Mock response', url });
      }, 1000);
    });
  }
}`,
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FeatureAModule } from './feature-a.module';
import { FeatureBModule } from './feature-b.module';
import {
  ConfigurableService,
  SERVICE_CONFIG,
  ServiceConfig
} from './configurable.service';

// Custom configuration
const customConfig: ServiceConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 10000,
  retries: 5
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FeatureAModule,
    FeatureBModule
  ],
  providers: [
    // Solution: Provide configuration using injection token
    { provide: SERVICE_CONFIG, useValue: customConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}`,
      'feature-a.component.ts': `import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared.service';
import { ConfigurableService } from './configurable.service';

@Component({
  selector: 'app-feature-a',
  template: \`
    <div>
      <h3>Feature A</h3>
      <p>Shared Service Instance: {{serviceInstanceId}}</p>
      <p>Data Count: {{dataCount}}</p>
      <button (click)="addData()">Add Data</button>
      <button (click)="clearData()">Clear Data</button>

      <h4>Shared Data:</h4>
      <ul>
        <li *ngFor="let item of data">{{item}}</li>
      </ul>

      <h4>Configurable Service:</h4>
      <p>API URL: {{config?.apiUrl}}</p>
      <p>Timeout: {{config?.timeout}}ms</p>
      <button (click)="makeRequest()">Make Request</button>
      <p *ngIf="requestResult">Result: {{requestResult}}</p>
    </div>
  \`
})
export class FeatureAComponent implements OnInit {
  serviceInstanceId: string;
  data: any[] = [];
  dataCount = 0;
  config: any;
  requestResult: string = '';

  constructor(
    private sharedService: SharedService,
    private configurableService: ConfigurableService
  ) {
    this.serviceInstanceId = this.sharedService.getInstanceId();
  }

  ngOnInit() {
    this.loadData();
    this.config = this.configurableService.getConfig();
  }

  addData() {
    const item = \`Feature A Item \${Date.now()}\`;
    this.sharedService.addData(item);
    this.loadData();
  }

  clearData() {
    this.sharedService.clearData();
    this.loadData();
  }

  async makeRequest() {
    try {
      const result = await this.configurableService.makeRequest('/users');
      this.requestResult = JSON.stringify(result);
    } catch (error) {
      this.requestResult = 'Error: ' + error;
    }
  }

  private loadData() {
    this.data = this.sharedService.getData();
    this.dataCount = this.sharedService.getDataCount();
  }
}`,
      'feature-b.component.ts': `import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-feature-b',
  template: \`
    <div>
      <h3>Feature B</h3>
      <p>Shared Service Instance: {{serviceInstanceId}}</p>
      <p>Data Count: {{dataCount}}</p>
      <button (click)="addData()">Add Data</button>

      <h4>Shared Data (same as Feature A):</h4>
      <ul>
        <li *ngFor="let item of data">{{item}}</li>
      </ul>
    </div>
  \`
})
export class FeatureBComponent implements OnInit {
  serviceInstanceId: string;
  data: any[] = [];
  dataCount = 0;

  constructor(private sharedService: SharedService) {
    this.serviceInstanceId = this.sharedService.getInstanceId();
  }

  ngOnInit() {
    this.loadData();
  }

  addData() {
    const item = \`Feature B Item \${Date.now()}\`;
    this.sharedService.addData(item);
    this.loadData();
  }

  private loadData() {
    this.data = this.sharedService.getData();
    this.dataCount = this.sharedService.getDataCount();
  }
}`
    },
    testCases: [
      'Both features should use the same service instance',
      'Data added in one feature should appear in the other',
      'Service instance IDs should be identical',
      'Configuration should be properly injected'
    ],
    debuggingSteps: [
      'Check service instance IDs in both components',
      'Use Angular DevTools to inspect service instances',
      'Add logging to service constructor',
      'Verify provider configuration in modules'
    ],
    commonMistakes: [
      'Providing services in multiple modules',
      'Not using providedIn: "root" for singletons',
      'Misunderstanding module vs component providers',
      'Not using injection tokens for configuration'
    ],
    productionImpact: 'Data inconsistency, multiple service instances, memory waste, broken shared state',
    preventionTips: [
      'Use providedIn: "root" for application-wide singletons',
      'Avoid providing services in feature modules',
      'Use forRoot() pattern for configurable services',
      'Understand Angular\'s hierarchical injector system'
    ]
  },

  // ===== ROUTING ISSUES (10 challenges) =====

  {
    id: 'angular-route-guard-infinite-loop',
    title: 'Route Guard Infinite Loop',
    description: 'Route guards causing infinite redirect loops and navigation failures',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['Angular', 'Routing', 'Guards', 'Navigation'],
    rootCause: 'Improper route guard logic causing circular redirects',
    category: 'Routing',
    files: {
      'auth.guard.ts': `import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated) {
      // BUG: Always redirecting to login without checking current route!
      this.router.navigate(['/login']);
      return false;
    }

    // BUG: Not handling role-based access properly
    const requiredRole = route.data['role'];
    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      // BUG: Redirecting to login instead of unauthorized page
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}`,
      'login.guard.ts': `import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      // BUG: Always redirecting to dashboard without checking intended route!
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}`,
      'app-routing.module.ts': `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile.component';
import { AdminComponent } from './admin.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard] // BUG: This can cause infinite loop!
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}`
    },
    hints: [
      'Check current route before redirecting in guards',
      'Use returnUrl parameter to redirect after login',
      'Handle unauthorized access with proper error pages',
      'Avoid circular redirects between guards'
    ],
    solution: {
      'auth.guard.ts': `import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated) {
      // Solution: Store intended URL and redirect to login
      const returnUrl = state.url;
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl }
      });
    }

    // Solution: Handle role-based access properly
    const requiredRole = route.data['role'];
    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      // Solution: Redirect to unauthorized page instead of login
      console.warn(\`Access denied. Required role: \${requiredRole}\`);
      return this.router.createUrlTree(['/unauthorized']);
    }

    return true;
  }
}`,
      'login.guard.ts': `import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      // Solution: Check for returnUrl parameter
      const returnUrl = route.queryParams['returnUrl'];

      if (returnUrl) {
        // Redirect to intended page
        return this.router.createUrlTree([returnUrl]);
      } else {
        // Default redirect to dashboard
        return this.router.createUrlTree(['/dashboard']);
      }
    }

    return true;
  }
}`,
      'auth.service.ts': `import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  id: number;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check for stored user on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Invalid stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          const user: User = {
            id: 1,
            username: 'admin',
            roles: ['admin', 'user']
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          resolve(true);
        } else if (username === 'user' && password === 'user') {
          const user: User = {
            id: 2,
            username: 'user',
            roles: ['user']
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}`,
      'app-routing.module.ts': `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile.component';
import { AdminComponent } from './admin.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  // Solution: Add unauthorized route
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  // Wildcard route for 404 errors
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Enable router tracing for debugging
    enableTracing: false, // Set to true for debugging
    // Handle initial navigation
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}`,
      'login.component.ts': `import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: \`
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div>
          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            [(ngModel)]="username"
            name="username"
            required
          >
        </div>
        <div>
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            [(ngModel)]="password"
            name="password"
            required
          >
        </div>
        <button type="submit" [disabled]="!loginForm.valid || isLoading">
          {{isLoading ? 'Logging in...' : 'Login'}}
        </button>
      </form>

      <div *ngIf="errorMessage" class="error">
        {{errorMessage}}
      </div>

      <div class="demo-credentials">
        <p>Demo credentials:</p>
        <p>Admin: admin/admin</p>
        <p>User: user/user</p>
      </div>
    </div>
  \`,
  styles: [\`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .error {
      color: red;
      margin-top: 10px;
    }

    .demo-credentials {
      margin-top: 20px;
      padding: 10px;
      background-color: #f0f0f0;
      border-radius: 4px;
      font-size: 12px;
    }
  \`]
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  private returnUrl: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  async onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const success = await this.authService.login(this.username, this.password);

      if (success) {
        // Solution: Navigate to return URL after successful login
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    } catch (error) {
      this.errorMessage = 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}`
    },
    testCases: [
      'Login guard should not cause infinite redirects',
      'Auth guard should preserve return URL',
      'Role-based access should redirect to unauthorized page',
      'Successful login should redirect to intended page'
    ],
    debuggingSteps: [
      'Enable router tracing to debug navigation',
      'Check browser network tab for redirect loops',
      'Add console logs in guard methods',
      'Test different user roles and routes'
    ],
    commonMistakes: [
      'Not checking current route before redirecting',
      'Creating circular redirects between guards',
      'Not handling return URLs properly',
      'Redirecting to login for authorization errors'
    ],
    productionImpact: 'Infinite redirect loops, broken navigation, poor user experience',
    preventionTips: [
      'Always check current route before redirecting',
      'Use UrlTree for conditional redirects',
      'Implement proper error pages for different scenarios',
      'Test guard combinations thoroughly'
    ]
  },

  // ===== REACTIVE FORMS ISSUES (8 challenges) =====

  {
    id: 'angular-reactive-forms-validation',
    title: 'Reactive Forms Validation Issues',
    description: 'Custom validators not working and validation state inconsistencies',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '22 min',
    xpReward: 150,
    tags: ['Angular', 'Reactive Forms', 'Validation', 'FormControl'],
    rootCause: 'Improper validator implementation and form state management',
    category: 'Forms',
    files: {
      'user-form.component.ts': `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: \`
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Email:</label>
        <input type="email" formControlName="email">
        <!-- BUG: Not showing validation errors properly -->
        <div *ngIf="userForm.get('email')?.invalid">
          Email is invalid
        </div>
      </div>

      <div>
        <label>Password:</label>
        <input type="password" formControlName="password">
        <div *ngIf="userForm.get('password')?.errors?.['required']">
          Password is required
        </div>
      </div>

      <div>
        <label>Confirm Password:</label>
        <input type="password" formControlName="confirmPassword">
        <!-- BUG: Custom validator not working -->
        <div *ngIf="userForm.get('confirmPassword')?.errors?.['passwordMismatch']">
          Passwords don't match
        </div>
      </div>

      <div>
        <label>Age:</label>
        <input type="number" formControlName="age">
        <div *ngIf="userForm.get('age')?.errors?.['ageRange']">
          Age must be between 18 and 100
        </div>
      </div>

      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>

    <div>
      <h3>Form Debug:</h3>
      <p>Form Valid: {{userForm.valid}}</p>
      <p>Form Errors: {{getFormErrors() | json}}</p>
    </div>
  \`
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      age: ['', [Validators.required, this.ageRangeValidator]]
    });

    // BUG: Adding validator to wrong control!
    this.userForm.get('confirmPassword')?.setValidators([
      Validators.required,
      this.passwordMatchValidator
    ]);
  }

  // BUG: Custom validator not implemented correctly
  ageRangeValidator(control: AbstractControl) {
    const age = control.value;
    if (age < 18 || age > 100) {
      return { ageRange: true };
    }
    return null;
  }

  // BUG: Password match validator doesn't have access to other controls
  passwordMatchValidator(control: AbstractControl) {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  getFormErrors() {
    // BUG: Not getting all form errors properly
    return this.userForm.errors;
  }
}`
    },
    hints: [
      'Use form-level validators for cross-field validation',
      'Check form control touched/dirty state for error display',
      'Implement proper error collection for debugging',
      'Use updateValueAndValidity() when needed'
    ],
    solution: {
      'user-form.component.ts': `import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: \`
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          [class.error]="isFieldInvalid('email')"
        >
        <!-- Solution: Proper error display with touched/dirty check -->
        <div class="error-messages" *ngIf="isFieldInvalid('email')">
          <div *ngIf="userForm.get('email')?.errors?.['required']">
            Email is required
          </div>
          <div *ngIf="userForm.get('email')?.errors?.['email']">
            Please enter a valid email address
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          [class.error]="isFieldInvalid('password')"
        >
        <div class="error-messages" *ngIf="isFieldInvalid('password')">
          <div *ngIf="userForm.get('password')?.errors?.['required']">
            Password is required
          </div>
          <div *ngIf="userForm.get('password')?.errors?.['minlength']">
            Password must be at least 8 characters long
          </div>
          <div *ngIf="userForm.get('password')?.errors?.['pattern']">
            Password must contain at least one uppercase letter, one lowercase letter, and one number
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          formControlName="confirmPassword"
          [class.error]="isFieldInvalid('confirmPassword')"
        >
        <div class="error-messages" *ngIf="isFieldInvalid('confirmPassword')">
          <div *ngIf="userForm.get('confirmPassword')?.errors?.['required']">
            Please confirm your password
          </div>
          <!-- Solution: Form-level validator error -->
          <div *ngIf="userForm.errors?.['passwordMismatch'] && userForm.get('confirmPassword')?.touched">
            Passwords don't match
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="age">Age:</label>
        <input
          id="age"
          type="number"
          formControlName="age"
          [class.error]="isFieldInvalid('age')"
        >
        <div class="error-messages" *ngIf="isFieldInvalid('age')">
          <div *ngIf="userForm.get('age')?.errors?.['required']">
            Age is required
          </div>
          <div *ngIf="userForm.get('age')?.errors?.['ageRange']">
            Age must be between 18 and 100
          </div>
          <div *ngIf="userForm.get('age')?.errors?.['min']">
            Age cannot be negative
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          [disabled]="userForm.invalid || isSubmitting"
          class="submit-btn"
        >
          {{isSubmitting ? 'Submitting...' : 'Submit'}}
        </button>
        <button
          type="button"
          (click)="resetForm()"
          class="reset-btn"
        >
          Reset
        </button>
      </div>
    </form>

    <!-- Enhanced debugging section -->
    <div class="debug-section" *ngIf="showDebug">
      <h3>Form Debug Information:</h3>
      <div class="debug-grid">
        <div>
          <strong>Form Status:</strong>
          <ul>
            <li>Valid: {{userForm.valid}}</li>
            <li>Invalid: {{userForm.invalid}}</li>
            <li>Pending: {{userForm.pending}}</li>
            <li>Disabled: {{userForm.disabled}}</li>
            <li>Touched: {{userForm.touched}}</li>
            <li>Dirty: {{userForm.dirty}}</li>
          </ul>
        </div>

        <div>
          <strong>Form Errors:</strong>
          <pre>{{getAllFormErrors() | json}}</pre>
        </div>

        <div>
          <strong>Form Values:</strong>
          <pre>{{userForm.value | json}}</pre>
        </div>
      </div>

      <button (click)="showDebug = false">Hide Debug</button>
    </div>

    <button *ngIf="!showDebug" (click)="showDebug = true" class="debug-toggle">
      Show Debug Info
    </button>
  \`,
  styles: [\`
    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    input.error {
      border-color: #dc3545;
      background-color: #fff5f5;
    }

    .error-messages {
      margin-top: 5px;
    }

    .error-messages div {
      color: #dc3545;
      font-size: 12px;
      margin-bottom: 2px;
    }

    .form-actions {
      margin-top: 20px;
    }

    .submit-btn, .reset-btn {
      padding: 10px 20px;
      margin-right: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .submit-btn {
      background-color: #007bff;
      color: white;
    }

    .submit-btn:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .reset-btn {
      background-color: #6c757d;
      color: white;
    }

    .debug-section {
      margin-top: 30px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .debug-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .debug-toggle {
      margin-top: 20px;
      padding: 5px 10px;
      background-color: #17a2b8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    pre {
      background-color: #e9ecef;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      overflow-x: auto;
    }
  \`]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isSubmitting = false;
  showDebug = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    this.setupFormSubscriptions();
  }

  private createForm() {
    this.userForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.customEmailValidator()
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', Validators.required],
      age: ['', [
        Validators.required,
        Validators.min(0),
        this.ageRangeValidator()
      ]]
    }, {
      // Solution: Form-level validator for cross-field validation
      validators: [this.passwordMatchValidator()]
    });
  }

  private setupFormSubscriptions() {
    // Update confirm password validation when password changes
    this.userForm.get('password')?.valueChanges.subscribe(() => {
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // Solution: Proper custom validator factory
  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const email = control.value.toLowerCase();
      const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];

      const domain = email.split('@')[1];
      if (blockedDomains.includes(domain)) {
        return { blockedDomain: { domain } };
      }

      return null;
    };
  }

  // Solution: Proper age validator factory
  ageRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const age = parseInt(control.value, 10);
      if (isNaN(age)) {
        return { invalidAge: true };
      }

      if (age < 18 || age > 100) {
        return { ageRange: { min: 18, max: 100, actual: age } };
      }

      return null;
    };
  }

  // Solution: Form-level validator for password matching
  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('password');
      const confirmPassword = form.get('confirmPassword');

      if (!password || !confirmPassword) return null;

      if (password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  // Solution: Helper method to check field validity
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Solution: Comprehensive error collection
  getAllFormErrors(): any {
    const formErrors: any = {};

    // Get form-level errors
    if (this.userForm.errors) {
      formErrors._form = this.userForm.errors;
    }

    // Get field-level errors
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control && control.errors) {
        formErrors[key] = control.errors;
      }
    });

    return formErrors;
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Form submitted successfully:', this.userForm.value);
      alert('User created successfully!');

      this.resetForm();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create user. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.userForm.reset();
    this.isSubmitting = false;
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}`
    },
    testCases: [
      'Email validation should work with custom validators',
      'Password matching should validate at form level',
      'Age validation should handle edge cases',
      'Error messages should show only when appropriate'
    ],
    debuggingSteps: [
      'Check form and field validation states',
      'Test custom validators with various inputs',
      'Verify form-level validator execution',
      'Monitor form value and validity changes'
    ],
    commonMistakes: [
      'Not using form-level validators for cross-field validation',
      'Showing errors before user interaction',
      'Improper custom validator implementation',
      'Not updating validation when dependent fields change'
    ],
    productionImpact: 'Poor user experience, invalid data submission, form usability issues',
    preventionTips: [
      'Use proper validator factories for reusable validators',
      'Implement form-level validators for cross-field validation',
      'Check touched/dirty state before showing errors',
      'Provide comprehensive error messages and debugging tools'
    ]
  },

  // ===== HTTP & INTERCEPTOR ISSUES (8 challenges) =====

  {
    id: 'angular-http-interceptor-infinite-loop',
    title: 'HTTP Interceptor Infinite Loop',
    description: 'HTTP interceptor causing infinite loops and request failures',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 160,
    tags: ['Angular', 'HTTP', 'Interceptors', 'Authentication'],
    rootCause: 'Interceptor intercepting its own requests causing infinite recursion',
    category: 'HTTP & Interceptors',
    files: {
      'auth.interceptor.ts': `import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // BUG: Adding auth header to ALL requests including auth endpoints!
    const authToken = this.authService.getToken();

    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: \`Bearer \${authToken}\`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // BUG: Refresh token request will also be intercepted!
          return this.authService.refreshToken().pipe(
            switchMap((newToken: string) => {
              // BUG: This creates infinite loop!
              const newReq = req.clone({
                setHeaders: {
                  Authorization: \`Bearer \${newToken}\`
                }
              });
              return next.handle(newReq);
            }),
            catchError((refreshError) => {
              this.authService.logout();
              return throwError(refreshError);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}`,
      'auth.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  login(credentials: any): Observable<any> {
    // BUG: This request will be intercepted by AuthInterceptor!
    return this.http.post(\`\${this.apiUrl}/login\`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
        }
      })
    );
  }

  refreshToken(): Observable<string> {
    // BUG: This request will also be intercepted causing infinite loop!
    return this.http.post<any>(\`\${this.apiUrl}/refresh\`, {}).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
        }
      })
    );
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
}`
    },
    hints: [
      'Exclude auth endpoints from token injection',
      'Use different HTTP client for refresh requests',
      'Check request URL before adding headers',
      'Implement proper retry logic with backoff'
    ],
    solution: {
      'auth.interceptor.ts': `import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solution: Exclude auth endpoints from token injection
    if (this.isAuthEndpoint(req.url)) {
      return next.handle(req);
    }

    const authToken = this.authService.getToken();

    if (authToken) {
      req = this.addTokenHeader(req, authToken);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
          return this.handle401Error(req, next);
        }
        return throwError(error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: \`Bearer \${token}\`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.token);

          return next.handle(this.addTokenHeader(request, token.token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(error);
        })
      );
    } else {
      // Wait for refresh to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token)))
      );
    }
  }
}`,
      'auth.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  login(credentials: any): Observable<any> {
    // Solution: This won't be intercepted due to URL exclusion
    return this.http.post(\`\${this.apiUrl}/login\`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    // Solution: This won't be intercepted due to URL exclusion
    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post<any>(\`\${this.apiUrl}/refresh\`, {
      refreshToken
    }).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}`
    },
    testCases: [
      'Login requests should not include auth headers',
      'Refresh token requests should not cause infinite loops',
      'Failed requests should retry with new token',
      'Multiple concurrent requests should wait for token refresh'
    ],
    debuggingSteps: [
      'Check network tab for infinite request loops',
      'Add logging to interceptor methods',
      'Verify auth endpoint exclusions',
      'Test token refresh scenarios'
    ],
    commonMistakes: [
      'Not excluding auth endpoints from interception',
      'Intercepting refresh token requests',
      'Not handling concurrent requests during refresh',
      'Missing proper error handling for refresh failures'
    ],
    productionImpact: 'Infinite request loops, authentication failures, poor user experience, server overload',
    preventionTips: [
      'Always exclude auth endpoints from token injection',
      'Implement proper refresh token handling',
      'Use request queuing during token refresh',
      'Add comprehensive error handling and logging'
    ]
  },

  // ===== LAZY LOADING & MODULES ISSUES (6 challenges) =====

  {
    id: 'angular-lazy-loading-shared-modules',
    title: 'Lazy Loading Shared Module Issues',
    description: 'Shared modules causing duplicate service instances in lazy-loaded modules',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 170,
    tags: ['Angular', 'Lazy Loading', 'Modules', 'Services', 'Architecture'],
    rootCause: 'Improper shared module configuration causing service duplication',
    category: 'Lazy Loading & Modules',
    files: {
      'shared.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from './shared.service';
import { LoadingComponent } from './loading.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [
    LoadingComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    ConfirmDialogComponent
  ],
  // BUG: Providing services in shared module!
  providers: [SharedService]
})
export class SharedModule {}`,
      'feature-a.module.ts': `import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FeatureAComponent } from './feature-a.component';
import { FeatureARoutingModule } from './feature-a-routing.module';

@NgModule({
  declarations: [FeatureAComponent],
  imports: [
    SharedModule, // BUG: This will create new instance of SharedService!
    FeatureARoutingModule
  ]
})
export class FeatureAModule {}`,
      'feature-b.module.ts': `import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FeatureBComponent } from './feature-b.component';
import { FeatureBRoutingModule } from './feature-b-routing.module';

@NgModule({
  declarations: [FeatureBComponent],
  imports: [
    SharedModule, // BUG: Another instance of SharedService!
    FeatureBRoutingModule
  ]
})
export class FeatureBModule {}`
    },
    hints: [
      'Use forRoot() pattern for services in shared modules',
      'Provide services only in root module or use providedIn: "root"',
      'Create separate shared modules for different purposes',
      'Understand Angular\'s module hierarchy and injection'
    ],
    solution: {
      'shared.module.ts': `import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from './shared.service';
import { LoadingComponent } from './loading.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [
    LoadingComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    ConfirmDialogComponent
  ]
  // Solution: No providers here!
})
export class SharedModule {
  // Solution: forRoot pattern for services
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [SharedService]
    };
  }
}`,
      'shared.service.ts': `import { Injectable } from '@angular/core';

// Solution: Use providedIn: 'root' for singleton services
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private data: any[] = [];
  private instanceId = Math.random().toString(36);

  constructor() {
    console.log('SharedService instance created:', this.instanceId);
  }

  addData(item: any): void {
    this.data.push(item);
    console.log('Data added to instance:', this.instanceId, this.data.length);
  }

  getData(): any[] {
    return [...this.data];
  }

  getInstanceId(): string {
    return this.instanceId;
  }

  clearData(): void {
    this.data = [];
  }
}`,
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // Solution: Use forRoot() in root module only
    SharedModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'feature-a',
        loadChildren: () => import('./feature-a/feature-a.module').then(m => m.FeatureAModule)
      },
      {
        path: 'feature-b',
        loadChildren: () => import('./feature-b/feature-b.module').then(m => m.FeatureBModule)
      },
      { path: '', redirectTo: '/feature-a', pathMatch: 'full' }
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}`,
      'feature-a.module.ts': `import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FeatureAComponent } from './feature-a.component';
import { FeatureARoutingModule } from './feature-a-routing.module';

@NgModule({
  declarations: [FeatureAComponent],
  imports: [
    SharedModule, // Solution: No forRoot() in feature modules
    FeatureARoutingModule
  ]
})
export class FeatureAModule {}`,
      'feature-b.module.ts': `import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FeatureBComponent } from './feature-b.component';
import { FeatureBRoutingModule } from './feature-b-routing.module';

@NgModule({
  declarations: [FeatureBComponent],
  imports: [
    SharedModule, // Solution: No forRoot() in feature modules
    FeatureBRoutingModule
  ]
})
export class FeatureBModule {}`,
      'feature-a.component.ts': `import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-feature-a',
  template: \`
    <div>
      <h2>Feature A</h2>
      <p>Service Instance ID: {{serviceInstanceId}}</p>
      <p>Data Count: {{dataCount}}</p>

      <button (click)="addData()">Add Data</button>
      <button (click)="clearData()">Clear Data</button>

      <h3>Data:</h3>
      <ul>
        <li *ngFor="let item of data">{{item}}</li>
      </ul>

      <app-loading *ngIf="isLoading"></app-loading>
    </div>
  \`
})
export class FeatureAComponent implements OnInit {
  serviceInstanceId: string;
  data: any[] = [];
  dataCount = 0;
  isLoading = false;

  constructor(private sharedService: SharedService) {
    this.serviceInstanceId = this.sharedService.getInstanceId();
  }

  ngOnInit() {
    this.loadData();
  }

  addData() {
    const item = \`Feature A Item \${Date.now()}\`;
    this.sharedService.addData(item);
    this.loadData();
  }

  clearData() {
    this.sharedService.clearData();
    this.loadData();
  }

  private loadData() {
    this.data = this.sharedService.getData();
    this.dataCount = this.data.length;
  }
}`,
      'feature-b.component.ts': `import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-feature-b',
  template: \`
    <div>
      <h2>Feature B</h2>
      <p>Service Instance ID: {{serviceInstanceId}}</p>
      <p>Data Count: {{dataCount}}</p>

      <button (click)="addData()">Add Data</button>
      <button (click)="viewData()">Refresh Data</button>

      <h3>Shared Data (should be same as Feature A):</h3>
      <ul>
        <li *ngFor="let item of data">{{item}}</li>
      </ul>

      <div *ngIf="serviceInstanceId">
        <p><strong>Instance Check:</strong>
          {{serviceInstanceId === expectedInstanceId ? 'SAME INSTANCE ✓' : 'DIFFERENT INSTANCE ✗'}}
        </p>
      </div>
    </div>
  \`
})
export class FeatureBComponent implements OnInit {
  serviceInstanceId: string;
  expectedInstanceId: string;
  data: any[] = [];
  dataCount = 0;

  constructor(private sharedService: SharedService) {
    this.serviceInstanceId = this.sharedService.getInstanceId();
    // This should be the same as Feature A if singleton is working
    this.expectedInstanceId = this.serviceInstanceId;
  }

  ngOnInit() {
    this.loadData();
  }

  addData() {
    const item = \`Feature B Item \${Date.now()}\`;
    this.sharedService.addData(item);
    this.loadData();
  }

  viewData() {
    this.loadData();
  }

  private loadData() {
    this.data = this.sharedService.getData();
    this.dataCount = this.data.length;
  }
}`
    },
    testCases: [
      'Both feature modules should use the same service instance',
      'Data added in one feature should appear in the other',
      'Service instance IDs should be identical',
      'Lazy-loaded modules should not create duplicate services'
    ],
    debuggingSteps: [
      'Check service instance IDs in different modules',
      'Use Angular DevTools to inspect service instances',
      'Add logging to service constructor',
      'Test data sharing between lazy-loaded modules'
    ],
    commonMistakes: [
      'Providing services in shared modules',
      'Not using forRoot() pattern correctly',
      'Importing shared modules with providers in feature modules',
      'Not understanding Angular\'s hierarchical injector'
    ],
    productionImpact: 'Data inconsistency, multiple service instances, memory waste, broken shared state',
    preventionTips: [
      'Use providedIn: "root" for singleton services',
      'Implement forRoot() pattern for shared modules with services',
      'Only use forRoot() in the root module',
      'Understand Angular\'s module and service architecture'
    ]
  },

  // ===== ANIMATION ISSUES (5 challenges) =====

  {
    id: 'angular-animation-memory-leak',
    title: 'Animation Memory Leaks',
    description: 'Animations not being properly cleaned up causing memory leaks',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 140,
    tags: ['Angular', 'Animations', 'Memory Leaks', 'Performance'],
    rootCause: 'Animation subscriptions and listeners not being properly disposed',
    category: 'Animations',
    files: {
      'animated-list.component.ts': `import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-animated-list',
  template: \`
    <div class="container">
      <button (click)="addItem()">Add Item</button>
      <button (click)="removeItem()">Remove Item</button>
      <button (click)="toggleAnimation()">Toggle Animation</button>

      <div class="items-container">
        <div
          *ngFor="let item of items; trackBy: trackByFn"
          [@slideIn]="item.state"
          (@slideIn.start)="onAnimationStart($event)"
          (@slideIn.done)="onAnimationDone($event)"
          class="item"
          [attr.data-id]="item.id"
        >
          {{item.name}} - {{item.state}}
        </div>
      </div>

      <div class="stats">
        <p>Items: {{items.length}}</p>
        <p>Animation Enabled: {{animationEnabled}}</p>
      </div>
    </div>
  \`,
  animations: [
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      state('out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('void => in', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition('in => out', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AnimatedListComponent implements OnInit, OnDestroy {
  items: any[] = [];
  animationEnabled = true;
  private destroy$ = new Subject<void>();
  private itemCounter = 0;

  // BUG: Animation event listeners not cleaned up!
  private animationListeners: any[] = [];

  ngOnInit() {
    // BUG: Creating interval without proper cleanup
    interval(2000).subscribe(() => {
      if (this.animationEnabled && this.items.length < 10) {
        this.addRandomItem();
      }
    });

    // BUG: Adding DOM event listeners without cleanup
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    // BUG: Not cleaning up animation listeners!
    // BUG: Not removing DOM event listeners!
  }

  addItem() {
    const item = {
      id: ++this.itemCounter,
      name: \`Item \${this.itemCounter}\`,
      state: 'in'
    };
    this.items.push(item);
  }

  removeItem() {
    if (this.items.length > 0) {
      const item = this.items[this.items.length - 1];
      item.state = 'out';

      // BUG: Not waiting for animation to complete before removing!
      setTimeout(() => {
        this.items.pop();
      }, 250); // BUG: Hardcoded timeout doesn't match animation duration!
    }
  }

  addRandomItem() {
    if (Math.random() > 0.5) {
      this.addItem();
    }
  }

  toggleAnimation() {
    this.animationEnabled = !this.animationEnabled;
  }

  onAnimationStart(event: AnimationEvent) {
    console.log('Animation started:', event);

    // BUG: Creating new listeners on every animation!
    const listener = () => {
      console.log('Animation progress...');
    };

    this.animationListeners.push(listener);
    // BUG: Adding listeners but never removing them!
  }

  onAnimationDone(event: AnimationEvent) {
    console.log('Animation completed:', event);

    // BUG: Not cleaning up completed animations!
    if (event.toState === 'out') {
      // Should remove item here, but logic is flawed
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  private handleVisibilityChange() {
    // BUG: This method will keep running even after component destruction!
    if (document.hidden) {
      this.animationEnabled = false;
    } else {
      this.animationEnabled = true;
    }
  }

  private handleResize() {
    // BUG: Another method that won't be cleaned up!
    console.log('Window resized');
  }
}`
    },
    hints: [
      'Use takeUntil pattern for subscription cleanup',
      'Remove DOM event listeners in ngOnDestroy',
      'Wait for animation completion before DOM manipulation',
      'Clean up animation-related subscriptions and listeners'
    ],
    solution: {
      'animated-list.component.ts': `import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
  AnimationBuilder,
  AnimationPlayer
} from '@angular/animations';
import { Subject, interval, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

interface ListItem {
  id: number;
  name: string;
  state: 'in' | 'out';
  animationPlayer?: AnimationPlayer;
}

@Component({
  selector: 'app-animated-list',
  template: \`
    <div class="container">
      <div class="controls">
        <button (click)="addItem()" [disabled]="isAnimating">Add Item</button>
        <button (click)="removeItem()" [disabled]="isAnimating || items.length === 0">Remove Item</button>
        <button (click)="toggleAnimation()">
          {{animationEnabled ? 'Disable' : 'Enable'}} Animation
        </button>
        <button (click)="clearAll()" [disabled]="isAnimating">Clear All</button>
      </div>

      <div class="items-container" #itemsContainer>
        <div
          *ngFor="let item of items; trackBy: trackByFn"
          [@slideIn]="item.state"
          (@slideIn.start)="onAnimationStart($event, item)"
          (@slideIn.done)="onAnimationDone($event, item)"
          class="item"
          [attr.data-id]="item.id"
          [class.animating]="item.animationPlayer"
        >
          <span class="item-content">{{item.name}}</span>
          <span class="item-state">{{item.state}}</span>
        </div>
      </div>

      <div class="stats">
        <p>Items: {{items.length}}</p>
        <p>Animation Enabled: {{animationEnabled}}</p>
        <p>Is Animating: {{isAnimating}}</p>
        <p>Active Players: {{activeAnimationPlayers.size}}</p>
      </div>
    </div>
  \`,
  styles: [\`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .controls {
      margin-bottom: 20px;
    }

    .controls button {
      margin-right: 10px;
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f8f9fa;
      cursor: pointer;
    }

    .controls button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .items-container {
      min-height: 200px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin: 5px 0;
      background: #e9ecef;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .item.animating {
      background: #fff3cd;
    }

    .item-content {
      font-weight: 500;
    }

    .item-state {
      font-size: 12px;
      color: #6c757d;
      text-transform: uppercase;
    }

    .stats {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .stats p {
      margin: 5px 0;
      font-size: 14px;
    }
  \`],
  animations: [
    trigger('slideIn', [
      state('in', style({
        transform: 'translateX(0) scale(1)',
        opacity: 1,
        height: '*'
      })),
      state('out', style({
        transform: 'translateX(-100%) scale(0.8)',
        opacity: 0,
        height: '0px',
        padding: '0px',
        margin: '0px'
      })),
      transition('void => in', [
        style({
          transform: 'translateX(-100%) scale(0.8)',
          opacity: 0,
          height: '0px',
          padding: '0px',
          margin: '0px'
        }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({
          transform: 'translateX(0) scale(1)',
          opacity: 1,
          height: '*',
          padding: '*',
          margin: '*'
        }))
      ]),
      transition('in => out', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({
          transform: 'translateX(-100%) scale(0.8)',
          opacity: 0,
          height: '0px',
          padding: '0px',
          margin: '0px'
        }))
      ])
    ])
  ]
})
export class AnimatedListComponent implements OnInit, OnDestroy {
  items: ListItem[] = [];
  animationEnabled = true;
  isAnimating = false;

  // Solution: Proper cleanup management
  private destroy$ = new Subject<void>();
  private itemCounter = 0;
  private activeAnimationPlayers = new Map<number, AnimationPlayer>();
  private pendingRemovals = new Set<number>();

  constructor(
    private cdr: ChangeDetectorRef,
    private animationBuilder: AnimationBuilder
  ) {}

  ngOnInit() {
    this.setupAutoAddItems();
    this.setupEventListeners();
  }

  ngOnDestroy() {
    // Solution: Comprehensive cleanup
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up all active animation players
    this.activeAnimationPlayers.forEach(player => {
      player.destroy();
    });
    this.activeAnimationPlayers.clear();

    // Clear pending operations
    this.pendingRemovals.clear();
  }

  private setupAutoAddItems() {
    // Solution: Proper subscription management with takeUntil
    interval(3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.animationEnabled && this.items.length < 8 && !this.isAnimating) {
          this.addRandomItem();
        }
      });
  }

  private setupEventListeners() {
    // Solution: Proper event listener cleanup
    fromEvent(document, 'visibilitychange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.handleVisibilityChange());

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(250),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.handleResize());
  }

  addItem() {
    if (this.isAnimating) return;

    const item: ListItem = {
      id: ++this.itemCounter,
      name: \`Item \${this.itemCounter}\`,
      state: 'in'
    };

    this.items.push(item);
    this.cdr.detectChanges();
  }

  removeItem() {
    if (this.isAnimating || this.items.length === 0) return;

    const item = this.items[this.items.length - 1];
    this.removeItemWithAnimation(item);
  }

  private removeItemWithAnimation(item: ListItem) {
    if (this.pendingRemovals.has(item.id)) return;

    this.pendingRemovals.add(item.id);
    item.state = 'out';
    this.cdr.detectChanges();
  }

  clearAll() {
    if (this.isAnimating) return;

    // Remove items one by one with staggered animation
    const removeNext = (index: number) => {
      if (index >= this.items.length) return;

      const item = this.items[index];
      this.removeItemWithAnimation(item);

      setTimeout(() => removeNext(index + 1), 100);
    };

    removeNext(0);
  }

  addRandomItem() {
    if (Math.random() > 0.3) {
      this.addItem();
    }
  }

  toggleAnimation() {
    this.animationEnabled = !this.animationEnabled;
  }

  onAnimationStart(event: AnimationEvent, item: ListItem) {
    console.log(\`Animation started for item \${item.id}:\`, event.triggerName);

    this.isAnimating = true;

    // Solution: Track animation state properly
    if (event.triggerName === 'slideIn') {
      // Create a simple tracking mechanism
      const startTime = Date.now();
      console.log(\`Item \${item.id} animation started at:\`, startTime);
    }
  }

  onAnimationDone(event: AnimationEvent, item: ListItem) {
    console.log(\`Animation completed for item \${item.id}:\`, event.triggerName, event.toState);

    // Solution: Proper cleanup after animation completion
    if (event.toState === 'out') {
      // Remove item from array after out animation completes
      const index = this.items.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.items.splice(index, 1);
        this.pendingRemovals.delete(item.id);
      }
    }

    // Clean up animation player if exists
    if (this.activeAnimationPlayers.has(item.id)) {
      const player = this.activeAnimationPlayers.get(item.id);
      if (player) {
        player.destroy();
      }
      this.activeAnimationPlayers.delete(item.id);
    }

    // Check if all animations are complete
    this.checkAnimationState();
    this.cdr.detectChanges();
  }

  private checkAnimationState() {
    // Update isAnimating based on active animations and pending removals
    this.isAnimating = this.activeAnimationPlayers.size > 0 || this.pendingRemovals.size > 0;
  }

  trackByFn(index: number, item: ListItem): number {
    return item.id;
  }

  private handleVisibilityChange() {
    // Solution: Safe visibility change handling
    if (document.hidden) {
      console.log('Page hidden - pausing animations');
      // Optionally pause animations when page is hidden
    } else {
      console.log('Page visible - resuming animations');
    }
  }

  private handleResize() {
    // Solution: Safe resize handling
    console.log('Window resized - adjusting layout if needed');
    // Perform any necessary layout adjustments
  }

  // Additional utility methods for better animation control
  pauseAllAnimations() {
    this.activeAnimationPlayers.forEach(player => {
      if (player.hasStarted() && !player.getPosition()) {
        player.pause();
      }
    });
  }

  resumeAllAnimations() {
    this.activeAnimationPlayers.forEach(player => {
      if (player.hasStarted()) {
        player.play();
      }
    });
  }

  getAnimationStats() {
    return {
      totalItems: this.items.length,
      activeAnimations: this.activeAnimationPlayers.size,
      pendingRemovals: this.pendingRemovals.size,
      isAnimating: this.isAnimating
    };
  }
}`
    },
    testCases: [
      'Animation subscriptions should be cleaned up on destroy',
      'DOM event listeners should be removed properly',
      'Animation players should be destroyed after completion',
      'Memory usage should not increase with repeated animations'
    ],
    debuggingSteps: [
      'Monitor memory usage during animations',
      'Check for subscription leaks in dev tools',
      'Verify event listener cleanup',
      'Test animation state management'
    ],
    commonMistakes: [
      'Not cleaning up animation subscriptions',
      'Forgetting to remove DOM event listeners',
      'Not destroying animation players',
      'Hardcoding animation timings without proper synchronization'
    ],
    productionImpact: 'Memory leaks, performance degradation, browser crashes, poor user experience',
    preventionTips: [
      'Always use takeUntil pattern for subscriptions',
      'Clean up all event listeners in ngOnDestroy',
      'Destroy animation players after completion',
      'Monitor memory usage during development'
    ]
  },

  // ===== TESTING & DEBUGGING ISSUES (6 challenges) =====

  {
    id: 'angular-unit-test-async-issues',
    title: 'Unit Test Async Operation Issues',
    description: 'Unit tests failing due to improper async operation handling',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['Angular', 'Testing', 'Async', 'Unit Tests', 'Jasmine'],
    rootCause: 'Not properly handling async operations in unit tests',
    category: 'Testing & Debugging',
    files: {
      'user.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, delay, retry } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      delay(100), // Simulate network delay
      retry(2),
      map(users => users.filter(user => user.active)),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(error);
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`).pipe(
      delay(50),
      catchError(error => throwError(error))
    );
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      delay(200),
      map(newUser => {
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
        return newUser;
      }),
      catchError(error => throwError(error))
    );
  }

  updateUser(id: number, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(\`\${this.apiUrl}/\${id}\`, updates).pipe(
      delay(150),
      map(updatedUser => {
        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex(u => u.id === id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this.usersSubject.next([...currentUsers]);
        }
        return updatedUser;
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`).pipe(
      delay(100),
      map(() => {
        const currentUsers = this.usersSubject.value;
        const filteredUsers = currentUsers.filter(u => u.id !== id);
        this.usersSubject.next(filteredUsers);
      })
    );
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(\`\${this.apiUrl}/search?q=\${query}\`).pipe(
      delay(300), // Longer delay for search
      map(users => users.filter(user => user.active))
    );
  }
}`,
      'user.service.spec.ts': `import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', active: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // BUG: Not handling async operations properly!
  it('should fetch users', () => {
    const result = service.getUsers();

    // BUG: Not subscribing to the observable!
    expect(result).toBeTruthy();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    // BUG: Expecting result immediately without waiting for async operation!
    expect(result).toEqual(mockUsers.filter(u => u.active));
  });

  // BUG: Not handling delays in tests
  it('should create user', () => {
    const newUser = { name: 'New User', email: 'new@example.com', active: true };
    const createdUser = { id: 4, ...newUser };

    service.createUser(newUser).subscribe(user => {
      // BUG: This assertion might not run due to async timing!
      expect(user).toEqual(createdUser);
    });

    const req = httpMock.expectOne('/api/users');
    req.flush(createdUser);

    // BUG: Not waiting for the delay() operator!
  });

  // BUG: Not testing error scenarios properly
  it('should handle errors', () => {
    service.getUsers().subscribe(
      users => {
        // BUG: This should not be called on error!
        expect(users).toBeDefined();
      },
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('/api/users');
    // BUG: Not testing retry behavior!
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  // BUG: Not testing BehaviorSubject updates
  it('should update users subject when creating user', () => {
    const newUser = { name: 'Test User', email: 'test@example.com', active: true };
    const createdUser = { id: 5, ...newUser };

    // BUG: Not subscribing to users$ to test the update!
    service.createUser(newUser).subscribe();

    const req = httpMock.expectOne('/api/users');
    req.flush(createdUser);

    // BUG: Not verifying that usersSubject was updated!
  });

  // BUG: Not testing search functionality with delays
  it('should search users', () => {
    const query = 'john';
    const searchResults = [mockUsers[0]];

    let result: User[] = [];
    service.searchUsers(query).subscribe(users => {
      result = users;
    });

    const req = httpMock.expectOne(\`/api/users/search?q=\${query}\`);
    req.flush(searchResults);

    // BUG: Checking result immediately without considering delay!
    expect(result).toEqual(searchResults);
  });
}`
    },
    hints: [
      'Use fakeAsync and tick() for testing delays',
      'Subscribe to observables in tests to trigger execution',
      'Use done() callback for async test completion',
      'Test error scenarios and retry behavior properly'
    ],
    solution: {
      'user.service.spec.ts': `import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', active: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Solution: Proper async testing with fakeAsync and tick
  it('should fetch users and filter active ones', fakeAsync(() => {
    let result: User[] = [];

    // Solution: Subscribe to the observable
    service.getUsers().subscribe(users => {
      result = users;
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    // Solution: Advance time to handle delay
    tick(100);

    // Solution: Now we can check the filtered result
    const expectedUsers = mockUsers.filter(u => u.active);
    expect(result).toEqual(expectedUsers);
    expect(result.length).toBe(2);
  }));

  // Solution: Test with proper async handling
  it('should create user and update subject', fakeAsync(() => {
    const newUser = { name: 'New User', email: 'new@example.com', active: true };
    const createdUser = { id: 4, ...newUser };

    let createdResult: User | null = null;
    let usersFromSubject: User[] = [];

    // Solution: Subscribe to both the creation and the subject
    service.users$.subscribe(users => {
      usersFromSubject = users;
    });

    service.createUser(newUser).subscribe(user => {
      createdResult = user;
    });

    const req = httpMock.expectOne('/api/users');
    req.flush(createdUser);

    // Solution: Advance time to handle delay
    tick(200);

    // Solution: Verify both the returned user and subject update
    expect(createdResult).toEqual(createdUser);
    expect(usersFromSubject).toContain(createdUser);
  }));

  // Solution: Proper error testing with retry behavior
  it('should handle errors and retry requests', fakeAsync(() => {
    let errorResult: any = null;
    let successResult: User[] | null = null;

    service.getUsers().subscribe(
      users => {
        successResult = users;
      },
      error => {
        errorResult = error;
      }
    );

    // Solution: Test retry behavior - expect 3 requests (1 initial + 2 retries)
    const req1 = httpMock.expectOne('/api/users');
    req1.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    tick(100); // Handle delay

    const req2 = httpMock.expectOne('/api/users');
    req2.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    tick(100);

    const req3 = httpMock.expectOne('/api/users');
    req3.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    tick(100);

    // Solution: After all retries, should have error
    expect(errorResult).toBeTruthy();
    expect(successResult).toBeNull();
  }));

  // Solution: Test successful retry scenario
  it('should succeed after retry', fakeAsync(() => {
    let result: User[] = [];

    service.getUsers().subscribe(users => {
      result = users;
    });

    // First request fails
    const req1 = httpMock.expectOne('/api/users');
    req1.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    tick(100);

    // Second request succeeds
    const req2 = httpMock.expectOne('/api/users');
    req2.flush(mockUsers);

    tick(100);

    // Should have successful result
    expect(result).toEqual(mockUsers.filter(u => u.active));
  }));

  // Solution: Test user update with subject notification
  it('should update user and notify subscribers', fakeAsync(() => {
    const userId = 1;
    const updates = { name: 'Updated Name' };
    const updatedUser = { ...mockUsers[0], ...updates };

    // Solution: Initialize the subject with some users first
    service['usersSubject'].next([...mockUsers]);

    let updatedResult: User | null = null;
    let usersFromSubject: User[] = [];

    service.users$.subscribe(users => {
      usersFromSubject = users;
    });

    service.updateUser(userId, updates).subscribe(user => {
      updatedResult = user;
    });

    const req = httpMock.expectOne(\`/api/users/\${userId}\`);
    req.flush(updatedUser);

    tick(150); // Handle delay

    expect(updatedResult).toEqual(updatedUser);
    expect(usersFromSubject.find(u => u.id === userId)).toEqual(updatedUser);
  }));

  // Solution: Test delete operation
  it('should delete user and update subject', fakeAsync(() => {
    const userId = 1;

    // Initialize subject with users
    service['usersSubject'].next([...mockUsers]);

    let usersFromSubject: User[] = [];
    service.users$.subscribe(users => {
      usersFromSubject = users;
    });

    service.deleteUser(userId).subscribe();

    const req = httpMock.expectOne(\`/api/users/\${userId}\`);
    req.flush(null);

    tick(100);

    expect(usersFromSubject.find(u => u.id === userId)).toBeUndefined();
    expect(usersFromSubject.length).toBe(mockUsers.length - 1);
  }));

  // Solution: Test search with proper delay handling
  it('should search users with delay', fakeAsync(() => {
    const query = 'john';
    const searchResults = [mockUsers[0]];

    let result: User[] = [];

    service.searchUsers(query).subscribe(users => {
      result = users;
    });

    const req = httpMock.expectOne(\`/api/users/search?q=\${query}\`);
    req.flush(searchResults);

    // Solution: Handle the search delay
    tick(300);

    expect(result).toEqual(searchResults);
  }));

  // Solution: Test getUserById
  it('should get user by id', fakeAsync(() => {
    const userId = 1;
    const expectedUser = mockUsers[0];

    let result: User | null = null;

    service.getUserById(userId).subscribe(user => {
      result = user;
    });

    const req = httpMock.expectOne(\`/api/users/\${userId}\`);
    req.flush(expectedUser);

    tick(50);

    expect(result).toEqual(expectedUser);
  }));

  // Solution: Test error handling for getUserById
  it('should handle getUserById error', fakeAsync(() => {
    const userId = 999;
    let errorResult: any = null;

    service.getUserById(userId).subscribe(
      user => {
        fail('Should not succeed');
      },
      error => {
        errorResult = error;
      }
    );

    const req = httpMock.expectOne(\`/api/users/\${userId}\`);
    req.flush('User not found', { status: 404, statusText: 'Not Found' });

    tick(50);

    expect(errorResult).toBeTruthy();
  }));

  // Solution: Test concurrent operations
  it('should handle concurrent operations', fakeAsync(() => {
    const newUser1 = { name: 'User 1', email: 'user1@example.com', active: true };
    const newUser2 = { name: 'User 2', email: 'user2@example.com', active: true };
    const createdUser1 = { id: 4, ...newUser1 };
    const createdUser2 = { id: 5, ...newUser2 };

    let results: User[] = [];

    // Start both operations
    service.createUser(newUser1).subscribe(user => results.push(user));
    service.createUser(newUser2).subscribe(user => results.push(user));

    // Handle both requests
    const req1 = httpMock.expectOne('/api/users');
    const req2 = httpMock.expectOne('/api/users');

    req1.flush(createdUser1);
    req2.flush(createdUser2);

    tick(200); // Handle delays

    expect(results).toContain(createdUser1);
    expect(results).toContain(createdUser2);
    expect(results.length).toBe(2);
  }));
}`
    },
    testCases: [
      'Async operations should be properly tested with fakeAsync',
      'Observable subscriptions should be handled correctly',
      'Error scenarios and retry behavior should be tested',
      'BehaviorSubject updates should be verified'
    ],
    debuggingSteps: [
      'Use fakeAsync and tick() for time-dependent operations',
      'Subscribe to observables to trigger execution',
      'Test both success and error scenarios',
      'Verify side effects like subject updates'
    ],
    commonMistakes: [
      'Not subscribing to observables in tests',
      'Not handling async delays properly',
      'Not testing error scenarios and retries',
      'Not verifying side effects like subject updates'
    ],
    productionImpact: 'Unreliable tests, missed bugs, false confidence in code quality',
    preventionTips: [
      'Always use fakeAsync for testing time-dependent operations',
      'Subscribe to observables to trigger execution',
      'Test both success and error paths',
      'Verify all side effects and state changes'
    ]
  },

  // ===== PERFORMANCE OPTIMIZATION ISSUES (7 challenges) =====

  {
    id: 'angular-unnecessary-rerendering',
    title: 'Unnecessary Component Re-rendering',
    description: 'Components re-rendering unnecessarily causing performance issues',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['Angular', 'Performance', 'Change Detection', 'OnPush', 'Optimization'],
    rootCause: 'Inefficient change detection strategy and unnecessary object recreations',
    category: 'Performance Optimization',
    files: {
      'product-list.component.ts': `import { Component, OnInit, Input } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

@Component({
  selector: 'app-product-list',
  template: \`
    <div class="product-list">
      <h2>Products ({{products.length}})</h2>

      <div class="filters">
        <select (change)="onCategoryChange($event)">
          <option value="">All Categories</option>
          <option *ngFor="let category of getCategories()" [value]="category">
            {{category}}
          </option>
        </select>

        <input
          type="text"
          placeholder="Search products..."
          (input)="onSearchChange($event)"
        >
      </div>

      <div class="products">
        <app-product-card
          *ngFor="let product of getFilteredProducts()"
          [product]="product"
          [isSelected]="isProductSelected(product)"
          (select)="onProductSelect(product)"
        ></app-product-card>
      </div>

      <div class="summary">
        Total: {{getFilteredProducts().length}} products
        In Stock: {{getInStockCount()}} products
      </div>
    </div>
  \`
})
export class ProductListComponent implements OnInit {
  @Input() products: Product[] = [];

  selectedCategory = '';
  searchTerm = '';
  selectedProducts: Product[] = [];

  ngOnInit() {
    console.log('ProductListComponent initialized');
  }

  // BUG: Method called in template - runs on every change detection!
  getCategories(): string[] {
    console.log('getCategories called'); // This will log constantly!

    // BUG: Creating new array every time!
    return this.products
      .map(p => p.category)
      .filter((category, index, arr) => arr.indexOf(category) === index)
      .sort();
  }

  // BUG: Another method called in template!
  getFilteredProducts(): Product[] {
    console.log('getFilteredProducts called'); // Logs on every change detection!

    // BUG: Complex filtering logic in template method!
    return this.products.filter(product => {
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }

  // BUG: Another template method!
  getInStockCount(): number {
    console.log('getInStockCount called');
    return this.getFilteredProducts().filter(p => p.inStock).length;
  }

  // BUG: Template method for selection check!
  isProductSelected(product: Product): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
  }

  onProductSelect(product: Product) {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index === -1) {
      // BUG: Creating new array reference every time!
      this.selectedProducts = [...this.selectedProducts, product];
    } else {
      this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
    }
  }
}`,
      'product-card.component.ts': `import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from './product-list.component';

@Component({
  selector: 'app-product-card',
  template: \`
    <div class="product-card" [class.selected]="isSelected">
      <h3>{{product.name}}</h3>
      <p>Price: {{formatPrice(product.price)}}</p>
      <p>Category: {{product.category}}</p>
      <p>Stock: {{getStockStatus(product)}}</p>

      <button (click)="onSelect()" [class.selected]="isSelected">
        {{isSelected ? 'Deselect' : 'Select'}}
      </button>

      <div class="metadata">
        Last updated: {{getCurrentTime()}}
      </div>
    </div>
  \`
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<Product>();

  // BUG: Method called in template!
  formatPrice(price: number): string {
    console.log('formatPrice called for', this.product?.name);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  // BUG: Another template method!
  getStockStatus(product: Product): string {
    console.log('getStockStatus called for', product.name);
    return product.inStock ? 'In Stock' : 'Out of Stock';
  }

  // BUG: Method that returns current time - will cause constant re-renders!
  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  onSelect() {
    this.select.emit(this.product);
  }
}`
    },
    hints: [
      'Use OnPush change detection strategy',
      'Move template methods to component properties',
      'Use pure pipes for data transformations',
      'Implement proper trackBy functions'
    ],
    solution: {
      'product-list.component.ts': `import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

@Component({
  selector: 'app-product-list',
  // Solution: Use OnPush change detection strategy
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="product-list">
      <h2>Products ({{products.length}})</h2>

      <div class="filters">
        <select (change)="onCategoryChange($event)" [value]="selectedCategory">
          <option value="">All Categories</option>
          <option *ngFor="let category of categories" [value]="category">
            {{category}}
          </option>
        </select>

        <input
          type="text"
          placeholder="Search products..."
          [value]="searchTerm"
          (input)="onSearchChange($event)"
        >
      </div>

      <div class="products">
        <app-product-card
          *ngFor="let product of filteredProducts; trackBy: trackByProductId"
          [product]="product"
          [isSelected]="selectedProductIds.has(product.id)"
          (select)="onProductSelect(product)"
        ></app-product-card>
      </div>

      <div class="summary">
        Total: {{filteredProducts.length}} products
        In Stock: {{inStockCount}} products
      </div>
    </div>
  \`
})
export class ProductListComponent implements OnInit, OnChanges {
  @Input() products: Product[] = [];

  selectedCategory = '';
  searchTerm = '';

  // Solution: Use component properties instead of methods
  categories: string[] = [];
  filteredProducts: Product[] = [];
  inStockCount = 0;

  // Solution: Use Set for efficient lookups
  selectedProductIds = new Set<number>();

  ngOnInit() {
    console.log('ProductListComponent initialized');
    this.updateDerivedData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products']) {
      this.updateDerivedData();
    }
  }

  // Solution: Update all derived data in one method
  private updateDerivedData() {
    this.updateCategories();
    this.updateFilteredProducts();
    this.updateInStockCount();
  }

  private updateCategories() {
    // Solution: Calculate once and store
    const categorySet = new Set(this.products.map(p => p.category));
    this.categories = Array.from(categorySet).sort();
  }

  private updateFilteredProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }

  private updateInStockCount() {
    this.inStockCount = this.filteredProducts.filter(p => p.inStock).length;
  }

  // Solution: Proper trackBy function for performance
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.updateFilteredProducts();
    this.updateInStockCount();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.updateFilteredProducts();
    this.updateInStockCount();
  }

  onProductSelect(product: Product) {
    if (this.selectedProductIds.has(product.id)) {
      this.selectedProductIds.delete(product.id);
    } else {
      this.selectedProductIds.add(product.id);
    }
  }

  // Public methods for external access if needed
  getSelectedProducts(): Product[] {
    return this.products.filter(p => this.selectedProductIds.has(p.id));
  }

  clearSelection() {
    this.selectedProductIds.clear();
  }

  selectAll() {
    this.filteredProducts.forEach(p => this.selectedProductIds.add(p.id));
  }
}`,
      'product-card.component.ts': `import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from './product-list.component';

@Component({
  selector: 'app-product-card',
  // Solution: Use OnPush change detection
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="product-card" [class.selected]="isSelected">
      <h3>{{product.name}}</h3>
      <p>Price: {{formattedPrice}}</p>
      <p>Category: {{product.category}}</p>
      <p>Stock: {{stockStatus}}</p>

      <button (click)="onSelect()" [class.selected]="isSelected">
        {{isSelected ? 'Deselect' : 'Select'}}
      </button>

      <div class="metadata">
        Card ID: {{product.id}}
      </div>
    </div>
  \`
})
export class ProductCardComponent implements OnInit, OnChanges {
  @Input() product!: Product;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<Product>();

  // Solution: Pre-calculated properties
  formattedPrice = '';
  stockStatus = '';

  private priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  ngOnInit() {
    this.updateDerivedData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.updateDerivedData();
    }
  }

  private updateDerivedData() {
    if (this.product) {
      // Solution: Calculate once and store
      this.formattedPrice = this.priceFormatter.format(this.product.price);
      this.stockStatus = this.product.inStock ? 'In Stock' : 'Out of Stock';
    }
  }

  onSelect() {
    this.select.emit(this.product);
  }
}`,
      'price-format.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
  pure: true // Solution: Pure pipe for performance
})
export class PriceFormatPipe implements PipeTransform {
  private formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  transform(price: number): string {
    return this.formatter.format(price);
  }
}`,
      'stock-status.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  pure: true
})
export class StockStatusPipe implements PipeTransform {
  transform(inStock: boolean): string {
    return inStock ? 'In Stock' : 'Out of Stock';
  }
}`,
      'optimized-product-card.component.ts': `import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Product } from './product-list.component';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="product-card" [class.selected]="isSelected">
      <h3>{{product.name}}</h3>
      <!-- Solution: Use pure pipes instead of methods -->
      <p>Price: {{product.price | priceFormat}}</p>
      <p>Category: {{product.category}}</p>
      <p>Stock: {{product.inStock | stockStatus}}</p>

      <button (click)="onSelect()" [class.selected]="isSelected">
        {{isSelected ? 'Deselect' : 'Select'}}
      </button>

      <div class="metadata">
        Card ID: {{product.id}}
      </div>
    </div>
  \`
})
export class OptimizedProductCardComponent {
  @Input() product!: Product;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<Product>();

  onSelect() {
    this.select.emit(this.product);
  }
}`
    },
    testCases: [
      'Components should not re-render unnecessarily',
      'Template methods should be replaced with properties',
      'OnPush change detection should work correctly',
      'TrackBy functions should prevent unnecessary DOM updates'
    ],
    debuggingSteps: [
      'Use Angular DevTools to monitor change detection cycles',
      'Add console.log statements to identify frequent method calls',
      'Profile component rendering performance',
      'Test with large datasets to identify bottlenecks'
    ],
    commonMistakes: [
      'Calling methods directly in templates',
      'Not using OnPush change detection strategy',
      'Creating new objects/arrays in template methods',
      'Not implementing trackBy functions for ngFor'
    ],
    productionImpact: 'Poor performance, slow UI, high CPU usage, bad user experience',
    preventionTips: [
      'Use OnPush change detection strategy',
      'Replace template methods with component properties',
      'Implement pure pipes for data transformations',
      'Always use trackBy functions with ngFor'
    ]
  },

  // ===== DIRECTIVE & PIPE ISSUES (5 challenges) =====

  {
    id: 'angular-custom-directive-lifecycle',
    title: 'Custom Directive Lifecycle Issues',
    description: 'Custom directive not handling lifecycle events properly',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '16 min',
    xpReward: 120,
    tags: ['Angular', 'Directives', 'Lifecycle', 'DOM'],
    rootCause: 'Improper lifecycle management and DOM manipulation in custom directives',
    category: 'Directives & Pipes',
    files: {
      'highlight.directive.ts': `import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit, OnDestroy {
  @Input() appHighlight: string = 'yellow';
  @Input() highlightDelay: number = 0;

  private originalColor: string = '';
  private timeoutId: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // BUG: Not storing original color properly!
    this.originalColor = this.el.nativeElement.style.backgroundColor;

    if (this.highlightDelay > 0) {
      // BUG: Not cleaning up timeout!
      this.timeoutId = setTimeout(() => {
        this.applyHighlight();
      }, this.highlightDelay);
    } else {
      this.applyHighlight();
    }
  }

  ngOnDestroy() {
    // BUG: Not cleaning up timeout!
    // BUG: Not restoring original color!
  }

  private applyHighlight() {
    // BUG: Direct DOM manipulation without safety checks!
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }
}`
    },
    hints: [
      'Clean up timeouts in ngOnDestroy',
      'Store and restore original styles properly',
      'Add safety checks for DOM manipulation',
      'Handle input changes with OnChanges'
    ],
    solution: {
      'highlight.directive.ts': `import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit, OnDestroy, OnChanges {
  @Input() appHighlight: string = 'yellow';
  @Input() highlightDelay: number = 0;
  @Input() highlightDuration: number = 0; // 0 means permanent

  private originalStyles: { [key: string]: string } = {};
  private timeoutId: any;
  private durationTimeoutId: any;
  private isHighlighted = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Solution: Store original styles safely
    this.storeOriginalStyles();
    this.applyHighlightWithDelay();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Solution: Handle input changes
    if (changes['appHighlight'] || changes['highlightDelay']) {
      this.clearTimeouts();
      if (this.isHighlighted) {
        this.removeHighlight();
      }
      this.applyHighlightWithDelay();
    }
  }

  ngOnDestroy() {
    // Solution: Comprehensive cleanup
    this.clearTimeouts();
    this.removeHighlight();
  }

  private storeOriginalStyles() {
    if (this.el.nativeElement) {
      const computedStyles = window.getComputedStyle(this.el.nativeElement);
      this.originalStyles = {
        backgroundColor: computedStyles.backgroundColor,
        transition: computedStyles.transition
      };
    }
  }

  private applyHighlightWithDelay() {
    if (this.highlightDelay > 0) {
      this.timeoutId = setTimeout(() => {
        this.applyHighlight();
      }, this.highlightDelay);
    } else {
      this.applyHighlight();
    }
  }

  private applyHighlight() {
    if (!this.el.nativeElement) return;

    // Solution: Use Renderer2 for safe DOM manipulation
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      this.appHighlight
    );

    // Add smooth transition
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'background-color 0.3s ease'
    );

    this.isHighlighted = true;

    // Solution: Handle highlight duration
    if (this.highlightDuration > 0) {
      this.durationTimeoutId = setTimeout(() => {
        this.removeHighlight();
      }, this.highlightDuration);
    }
  }

  private removeHighlight() {
    if (!this.el.nativeElement || !this.isHighlighted) return;

    // Solution: Restore original styles
    Object.keys(this.originalStyles).forEach(property => {
      this.renderer.setStyle(
        this.el.nativeElement,
        property,
        this.originalStyles[property]
      );
    });

    this.isHighlighted = false;
  }

  private clearTimeouts() {
    // Solution: Clear all timeouts
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.durationTimeoutId) {
      clearTimeout(this.durationTimeoutId);
      this.durationTimeoutId = null;
    }
  }

  // Public methods for programmatic control
  public highlight() {
    this.clearTimeouts();
    this.applyHighlight();
  }

  public removeHighlightManually() {
    this.clearTimeouts();
    this.removeHighlight();
  }

  public toggle() {
    if (this.isHighlighted) {
      this.removeHighlightManually();
    } else {
      this.highlight();
    }
  }
}`
    },
    testCases: [
      'Directive should clean up timeouts on destroy',
      'Original styles should be restored properly',
      'DOM manipulation should be safe',
      'Input changes should be handled correctly'
    ],
    debuggingSteps: [
      'Check for memory leaks with timeouts',
      'Verify original styles are stored and restored',
      'Test directive with dynamic input changes',
      'Ensure proper cleanup on component destruction'
    ],
    commonMistakes: [
      'Not cleaning up timeouts in ngOnDestroy',
      'Direct DOM manipulation without safety checks',
      'Not handling input changes properly',
      'Not restoring original styles'
    ],
    productionImpact: 'Memory leaks, DOM manipulation errors, poor user experience',
    preventionTips: [
      'Always clean up timeouts and subscriptions',
      'Use Renderer2 for safe DOM manipulation',
      'Implement OnChanges for input handling',
      'Store and restore original styles properly'
    ]
  },

  // ===== ANGULAR MATERIAL INTEGRATION ISSUES (4 challenges) =====

  {
    id: 'angular-material-theme-issues',
    title: 'Angular Material Theme Configuration Issues',
    description: 'Problems with Angular Material theme setup and customization',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['Angular', 'Angular Material', 'Theming', 'SCSS'],
    rootCause: 'Incorrect theme configuration and CSS specificity issues',
    category: 'Angular Material Integration',
    files: {
      'styles.scss': `@use '@angular/material' as mat;

// BUG: Not including core styles!
// @include mat.core();

// BUG: Incorrect theme definition!
$primary: mat.define-palette(mat.$indigo-palette);
$accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$warn: mat.define-palette(mat.$red-palette);

// BUG: Not defining theme properly!
$theme: mat.define-light-theme($primary, $accent, $warn);

// BUG: Not including theme styles!
// @include mat.all-component-themes($theme);

// BUG: Custom styles with wrong specificity!
.mat-button {
  background-color: blue !important; // Bad practice!
}

.custom-card {
  .mat-card-header {
    background: red; // BUG: Will be overridden!
  }
}`,
      'app.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <mat-toolbar color="primary">
      <span>My App</span>
    </mat-toolbar>

    <div class="container">
      <mat-card class="custom-card">
        <mat-card-header>
          <mat-card-title>Card Title</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Card content goes here</p>

          <!-- BUG: Not using proper Material form field! -->
          <input type="text" placeholder="Enter text">

          <mat-button-toggle-group>
            <mat-button-toggle value="option1">Option 1</mat-button-toggle>
            <mat-button-toggle value="option2">Option 2</mat-button-toggle>
          </mat-button-toggle-group>
        </mat-card-content>
        <mat-card-actions>
          <!-- BUG: Inconsistent button styling! -->
          <button mat-button>Cancel</button>
          <button mat-raised-button color="primary">Save</button>
        </mat-card-actions>
      </mat-card>
    </div>
  \`,
  styles: [\`
    .container {
      padding: 20px;
    }

    // BUG: Trying to override Material styles incorrectly!
    .mat-card {
      box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
    }

    // BUG: Not using Material's spacing system!
    .custom-card {
      margin: 10px;
    }
  \`]
})
export class AppComponent {}`
    },
    hints: [
      'Include mat.core() and component themes properly',
      'Use Material Design spacing and elevation systems',
      'Avoid !important and use proper CSS specificity',
      'Use mat-form-field for input elements'
    ],
    solution: {
      'styles.scss': `@use '@angular/material' as mat;

// Solution: Include core Material styles
@include mat.core();

// Solution: Proper theme definition
$primary: mat.define-palette(mat.$indigo-palette);
$accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$warn: mat.define-palette(mat.$red-palette);

// Solution: Define theme with proper structure
$theme: mat.define-light-theme((
  color: (
    primary: $primary,
    accent: $accent,
    warn: $warn,
  )
));

// Solution: Include all component themes
@include mat.all-component-themes($theme);

// Solution: Custom theme for specific components
@include mat.button-theme($theme);
@include mat.card-theme($theme);
@include mat.toolbar-theme($theme);

// Solution: Proper custom styling without !important
.custom-card {
  // Use Material's elevation system
  @include mat.elevation(4);

  // Use theme colors properly
  .mat-card-header {
    background-color: mat.get-color-from-palette($primary, 50);

    .mat-card-title {
      color: mat.get-color-from-palette($primary, 700);
    }
  }

  // Use Material's spacing system
  margin: mat.get-spacing(2);

  .mat-card-content {
    padding: mat.get-spacing(3);
  }
}

// Solution: Responsive design with Material breakpoints
@media (max-width: 768px) {
  .custom-card {
    margin: mat.get-spacing(1);

    .mat-card-content {
      padding: mat.get-spacing(2);
    }
  }
}

// Solution: Dark theme support
.dark-theme {
  $dark-theme: mat.define-dark-theme((
    color: (
      primary: $primary,
      accent: $accent,
      warn: $warn,
    )
  ));

  @include mat.all-component-colors($dark-theme);
}`,
      'app.component.ts': `import { Component, OnInit } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  template: \`
    <mat-toolbar color="primary">
      <span>My App</span>
      <span class="spacer"></span>
      <button mat-icon-button (click)="toggleTheme()">
        <mat-icon>{{isDarkTheme ? 'light_mode' : 'dark_mode'}}</mat-icon>
      </button>
    </mat-toolbar>

    <div class="container">
      <mat-card class="custom-card">
        <mat-card-header>
          <mat-card-title>Card Title</mat-card-title>
          <mat-card-subtitle>Card subtitle</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p>Card content goes here</p>

          <!-- Solution: Proper Material form field -->
          <mat-form-field appearance="outline">
            <mat-label>Enter text</mat-label>
            <input matInput type="text" [(ngModel)]="inputValue">
            <mat-hint>This is a hint</mat-hint>
          </mat-form-field>

          <mat-button-toggle-group [(value)]="selectedOption">
            <mat-button-toggle value="option1">Option 1</mat-button-toggle>
            <mat-button-toggle value="option2">Option 2</mat-button-toggle>
            <mat-button-toggle value="option3">Option 3</mat-button-toggle>
          </mat-button-toggle-group>
        </mat-card-content>

        <mat-card-actions align="end">
          <!-- Solution: Consistent button styling -->
          <button mat-button color="accent">Cancel</button>
          <button mat-raised-button color="primary">Save</button>
        </mat-card-actions>
      </mat-card>

      <!-- Solution: Additional Material components showcase -->
      <mat-card class="demo-card">
        <mat-card-header>
          <mat-card-title>Component Showcase</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-chip-list>
            <mat-chip *ngFor="let chip of chips" [removable]="true" (removed)="removeChip(chip)">
              {{chip}}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip>
          </mat-chip-list>

          <mat-progress-bar mode="determinate" [value]="progressValue"></mat-progress-bar>

          <mat-slider min="0" max="100" step="1" [(value)]="progressValue"></mat-slider>
        </mat-card-content>
      </mat-card>
    </div>
  \`,
  styles: [\`
    .container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .custom-card, .demo-card {
      margin-bottom: 16px;
    }

    .mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .mat-button-toggle-group {
      margin-bottom: 16px;
    }

    .mat-chip-list {
      margin-bottom: 16px;
    }

    .mat-progress-bar {
      margin-bottom: 16px;
    }
  \`]
})
export class AppComponent implements OnInit {
  inputValue = '';
  selectedOption = 'option1';
  isDarkTheme = false;
  progressValue = 50;
  chips = ['Angular', 'Material', 'TypeScript', 'RxJS'];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  removeChip(chip: string) {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }
}`,
      'theme.service.ts': `import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkThemeSubject = new BehaviorSubject<boolean>(false);
  public isDarkTheme$ = this.darkThemeSubject.asObservable();

  constructor() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    this.setTheme(isDark);
  }

  toggleTheme() {
    const currentTheme = this.darkThemeSubject.value;
    this.setTheme(!currentTheme);
  }

  private setTheme(isDark: boolean) {
    this.darkThemeSubject.next(isDark);

    // Apply theme class to body
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }

    // Save theme preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}`,
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// Solution: Import all required Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { ThemeService } from './theme.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    // Material modules
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSliderModule
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }`
    },
    testCases: [
      'Material theme should be applied correctly',
      'Custom styling should not conflict with Material styles',
      'Form fields should use proper Material components',
      'Theme switching should work properly'
    ],
    debuggingSteps: [
      'Check if mat.core() is included',
      'Verify theme definition and inclusion',
      'Test custom styles without !important',
      'Validate Material component imports'
    ],
    commonMistakes: [
      'Not including mat.core() styles',
      'Using !important to override Material styles',
      'Not using proper Material form components',
      'Incorrect theme configuration'
    ],
    productionImpact: 'Inconsistent UI, theme issues, accessibility problems, poor user experience',
    preventionTips: [
      'Always include mat.core() and component themes',
      'Use Material Design system for spacing and colors',
      'Avoid !important and use proper CSS specificity',
      'Use appropriate Material components for forms'
    ]
  },

  // ===== COMPONENT COMMUNICATION ISSUES (6 challenges) =====

  {
    id: 'angular-parent-child-communication',
    title: 'Parent-Child Component Communication Issues',
    description: 'Problems with data flow between parent and child components',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '17 min',
    xpReward: 125,
    tags: ['Angular', 'Component Communication', 'Input', 'Output', 'ViewChild'],
    rootCause: 'Improper implementation of component communication patterns',
    category: 'Component Communication',
    files: {
      'parent.component.ts': `import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
  selector: 'app-parent',
  template: \`
    <div class="parent">
      <h2>Parent Component</h2>

      <div class="controls">
        <button (click)="updateChildData()">Update Child Data</button>
        <button (click)="getChildValue()">Get Child Value</button>
        <button (click)="callChildMethod()">Call Child Method</button>
      </div>

      <!-- BUG: Not handling data changes properly! -->
      <app-child
        [inputData]="childData"
        (dataChange)="onChildDataChange($event)"
        #childRef>
      </app-child>

      <div class="parent-info">
        <p>Parent knows child value: {{childValue}}</p>
        <p>Data from child: {{dataFromChild}}</p>
      </div>
    </div>
  \`
})
export class ParentComponent implements AfterViewInit {
  @ViewChild('childRef') childComponent!: ChildComponent;

  childData = { name: 'Initial Data', count: 0 };
  childValue = '';
  dataFromChild = '';

  ngAfterViewInit() {
    // BUG: Accessing child component immediately without checking!
    this.childValue = this.childComponent.getCurrentValue();
  }

  updateChildData() {
    // BUG: Mutating object directly!
    this.childData.count++;
    this.childData.name = \`Updated Data \${this.childData.count}\`;
  }

  getChildValue() {
    // BUG: Not checking if child component exists!
    this.childValue = this.childComponent.getCurrentValue();
  }

  callChildMethod() {
    // BUG: Not handling potential errors!
    this.childComponent.performAction('Parent triggered action');
  }

  onChildDataChange(data: any) {
    // BUG: Not validating incoming data!
    this.dataFromChild = data;
  }
}`,
      'child.component.ts': `import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child',
  template: \`
    <div class="child">
      <h3>Child Component</h3>

      <div class="child-info">
        <p>Received from parent: {{inputData?.name}} ({{inputData?.count}})</p>
        <p>Internal value: {{internalValue}}</p>
      </div>

      <div class="child-controls">
        <input
          type="text"
          [(ngModel)]="internalValue"
          (input)="onInternalValueChange()"
        >
        <button (click)="emitDataChange()">Send Data to Parent</button>
        <button (click)="incrementCounter()">Increment Counter</button>
      </div>

      <div class="status">
        <p>Action result: {{actionResult}}</p>
      </div>
    </div>
  \`
})
export class ChildComponent implements OnChanges {
  @Input() inputData: any;
  @Output() dataChange = new EventEmitter<any>();

  internalValue = 'Child internal value';
  actionResult = '';
  private counter = 0;

  ngOnChanges(changes: SimpleChanges) {
    // BUG: Not handling changes properly!
    if (changes['inputData']) {
      console.log('Input data changed:', changes['inputData'].currentValue);
      // BUG: Not validating input data!
    }
  }

  onInternalValueChange() {
    // BUG: Emitting on every keystroke!
    this.dataChange.emit(this.internalValue);
  }

  emitDataChange() {
    // BUG: Not structuring emitted data properly!
    this.dataChange.emit(this.internalValue);
  }

  incrementCounter() {
    this.counter++;
    // BUG: Not notifying parent of counter changes!
  }

  getCurrentValue(): string {
    // BUG: Not handling potential null/undefined values!
    return this.internalValue + ' - ' + this.inputData.name;
  }

  performAction(message: string): void {
    // BUG: Not handling errors in action!
    this.actionResult = \`Action performed: \${message} at \${new Date().toLocaleTimeString()}\`;

    // BUG: Not emitting action completion!
  }
}`
    },
    hints: [
      'Use proper change detection for object mutations',
      'Implement proper error handling for ViewChild access',
      'Validate data in component communication',
      'Use structured data for complex communications'
    ],
    solution: {
      'parent.component.ts': `import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ChildComponent } from './child.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ChildData {
  name: string;
  count: number;
  timestamp?: Date;
}

interface ChildEmittedData {
  type: 'value_change' | 'action_complete' | 'counter_change';
  data: any;
  timestamp: Date;
}

@Component({
  selector: 'app-parent',
  template: \`
    <div class="parent">
      <h2>Parent Component</h2>

      <div class="controls">
        <button (click)="updateChildData()" [disabled]="!isChildReady">
          Update Child Data
        </button>
        <button (click)="getChildValue()" [disabled]="!isChildReady">
          Get Child Value
        </button>
        <button (click)="callChildMethod()" [disabled]="!isChildReady">
          Call Child Method
        </button>
        <button (click)="resetChild()" [disabled]="!isChildReady">
          Reset Child
        </button>
      </div>

      <!-- Solution: Proper data binding with immutable updates -->
      <app-child
        [inputData]="childData"
        [isEnabled]="isChildEnabled"
        (dataChange)="onChildDataChange($event)"
        (actionComplete)="onChildActionComplete($event)"
        #childRef>
      </app-child>

      <div class="parent-info">
        <p>Child ready: {{isChildReady}}</p>
        <p>Parent knows child value: {{childValue}}</p>
        <p>Last data from child: {{lastDataFromChild | json}}</p>
        <p>Communication log:</p>
        <ul>
          <li *ngFor="let log of communicationLog">
            {{log.timestamp | date:'medium'}} - {{log.message}}
          </li>
        </ul>
      </div>
    </div>
  \`
})
export class ParentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('childRef') childComponent!: ChildComponent;

  // Solution: Immutable data structure
  childData: ChildData = {
    name: 'Initial Data',
    count: 0,
    timestamp: new Date()
  };

  childValue = '';
  lastDataFromChild: ChildEmittedData | null = null;
  isChildReady = false;
  isChildEnabled = true;
  communicationLog: Array<{timestamp: Date, message: string}> = [];

  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Solution: Proper ViewChild initialization with delay
    setTimeout(() => {
      if (this.childComponent) {
        this.isChildReady = true;
        this.getChildValue();
        this.logCommunication('Child component initialized');
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateChildData() {
    try {
      // Solution: Create new object instead of mutating
      this.childData = {
        ...this.childData,
        count: this.childData.count + 1,
        name: \`Updated Data \${this.childData.count + 1}\`,
        timestamp: new Date()
      };

      this.logCommunication(\`Updated child data: count=\${this.childData.count}\`);
    } catch (error) {
      console.error('Error updating child data:', error);
      this.logCommunication('Error updating child data');
    }
  }

  getChildValue() {
    try {
      // Solution: Check if child component exists and is ready
      if (this.childComponent && this.isChildReady) {
        this.childValue = this.childComponent.getCurrentValue();
        this.logCommunication('Retrieved child value');
      } else {
        console.warn('Child component not ready');
        this.logCommunication('Child component not ready for value retrieval');
      }
    } catch (error) {
      console.error('Error getting child value:', error);
      this.childValue = 'Error retrieving value';
      this.logCommunication('Error retrieving child value');
    }
  }

  callChildMethod() {
    try {
      // Solution: Proper error handling for child method calls
      if (this.childComponent && this.isChildReady) {
        const message = \`Parent triggered action at \${new Date().toLocaleTimeString()}\`;
        this.childComponent.performAction(message);
        this.logCommunication('Called child method');
      } else {
        console.warn('Child component not ready');
        this.logCommunication('Child component not ready for method call');
      }
    } catch (error) {
      console.error('Error calling child method:', error);
      this.logCommunication('Error calling child method');
    }
  }

  resetChild() {
    try {
      if (this.childComponent && this.isChildReady) {
        this.childComponent.reset();
        this.childData = {
          name: 'Reset Data',
          count: 0,
          timestamp: new Date()
        };
        this.childValue = '';
        this.logCommunication('Reset child component');
      }
    } catch (error) {
      console.error('Error resetting child:', error);
      this.logCommunication('Error resetting child');
    }
  }

  onChildDataChange(data: ChildEmittedData) {
    try {
      // Solution: Validate incoming data
      if (this.isValidChildData(data)) {
        this.lastDataFromChild = data;
        this.logCommunication(\`Received from child: \${data.type}\`);

        // Handle different types of data
        switch (data.type) {
          case 'value_change':
            this.childValue = data.data;
            break;
          case 'counter_change':
            this.logCommunication(\`Child counter: \${data.data}\`);
            break;
        }
      } else {
        console.warn('Invalid data received from child:', data);
        this.logCommunication('Received invalid data from child');
      }
    } catch (error) {
      console.error('Error handling child data change:', error);
      this.logCommunication('Error handling child data');
    }
  }

  onChildActionComplete(result: any) {
    this.logCommunication(\`Child action completed: \${result}\`);
  }

  private isValidChildData(data: any): data is ChildEmittedData {
    return data &&
           typeof data === 'object' &&
           typeof data.type === 'string' &&
           data.timestamp instanceof Date;
  }

  private logCommunication(message: string) {
    this.communicationLog.unshift({
      timestamp: new Date(),
      message
    });

    // Keep only last 10 entries
    if (this.communicationLog.length > 10) {
      this.communicationLog = this.communicationLog.slice(0, 10);
    }
  }
}`,
      'child.component.ts': `import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

interface ChildData {
  name: string;
  count: number;
  timestamp?: Date;
}

interface ChildEmittedData {
  type: 'value_change' | 'action_complete' | 'counter_change';
  data: any;
  timestamp: Date;
}

@Component({
  selector: 'app-child',
  template: \`
    <div class="child" [class.disabled]="!isEnabled">
      <h3>Child Component</h3>

      <div class="child-info">
        <p>Received from parent: {{displayInputData}}</p>
        <p>Internal value: {{internalValue}}</p>
        <p>Internal counter: {{counter}}</p>
      </div>

      <div class="child-controls">
        <input
          type="text"
          [(ngModel)]="internalValue"
          (input)="onInternalValueChange()"
          [disabled]="!isEnabled"
          placeholder="Enter value..."
        >
        <button
          (click)="emitDataChange()"
          [disabled]="!isEnabled || !internalValue.trim()">
          Send Data to Parent
        </button>
        <button
          (click)="incrementCounter()"
          [disabled]="!isEnabled">
          Increment Counter
        </button>
        <button
          (click)="reset()"
          [disabled]="!isEnabled">
          Reset
        </button>
      </div>

      <div class="status">
        <p>Action result: {{actionResult}}</p>
        <p>Last change: {{lastChangeTime | date:'medium'}}</p>
      </div>
    </div>
  \`
})
export class ChildComponent implements OnInit, OnChanges, OnDestroy {
  @Input() inputData: ChildData | null = null;
  @Input() isEnabled = true;
  @Output() dataChange = new EventEmitter<ChildEmittedData>();
  @Output() actionComplete = new EventEmitter<string>();

  internalValue = 'Child internal value';
  actionResult = '';
  counter = 0;
  lastChangeTime: Date | null = null;
  displayInputData = 'No data received';

  private destroy$ = new Subject<void>();
  private valueChangeSubject = new Subject<string>();

  ngOnInit() {
    // Solution: Debounce value changes to avoid excessive emissions
    this.valueChangeSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.emitValueChange(value);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Solution: Proper change handling with validation
    if (changes['inputData']) {
      const currentValue = changes['inputData'].currentValue;
      const previousValue = changes['inputData'].previousValue;

      if (this.isValidInputData(currentValue)) {
        this.displayInputData = \`\${currentValue.name} (count: \${currentValue.count})\`;

        if (currentValue.timestamp) {
          this.lastChangeTime = currentValue.timestamp;
        }

        console.log('Valid input data received:', currentValue);
      } else {
        this.displayInputData = 'Invalid data received';
        console.warn('Invalid input data:', currentValue);
      }

      // Log the change for debugging
      if (!changes['inputData'].firstChange) {
        console.log('Input data changed from:', previousValue, 'to:', currentValue);
      }
    }

    if (changes['isEnabled']) {
      console.log('Component enabled state changed:', changes['isEnabled'].currentValue);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInternalValueChange() {
    // Solution: Use debounced subject instead of immediate emission
    this.valueChangeSubject.next(this.internalValue);
  }

  emitDataChange() {
    try {
      // Solution: Structure emitted data properly
      const emittedData: ChildEmittedData = {
        type: 'value_change',
        data: this.internalValue.trim(),
        timestamp: new Date()
      };

      this.dataChange.emit(emittedData);
      this.actionResult = 'Data sent to parent successfully';
      this.lastChangeTime = new Date();
    } catch (error) {
      console.error('Error emitting data change:', error);
      this.actionResult = 'Error sending data to parent';
    }
  }

  incrementCounter() {
    try {
      this.counter++;

      // Solution: Notify parent of counter changes
      const emittedData: ChildEmittedData = {
        type: 'counter_change',
        data: this.counter,
        timestamp: new Date()
      };

      this.dataChange.emit(emittedData);
      this.actionResult = \`Counter incremented to \${this.counter}\`;
      this.lastChangeTime = new Date();
    } catch (error) {
      console.error('Error incrementing counter:', error);
      this.actionResult = 'Error incrementing counter';
    }
  }

  getCurrentValue(): string {
    try {
      // Solution: Handle potential null/undefined values
      const inputName = this.inputData?.name || 'No input data';
      const safeInternalValue = this.internalValue || 'Empty value';

      return \`\${safeInternalValue} - \${inputName} (counter: \${this.counter})\`;
    } catch (error) {
      console.error('Error getting current value:', error);
      return 'Error retrieving value';
    }
  }

  performAction(message: string): void {
    try {
      // Solution: Proper error handling and action completion notification
      if (!message || typeof message !== 'string') {
        throw new Error('Invalid message provided');
      }

      this.actionResult = \`Action performed: \${message} at \${new Date().toLocaleTimeString()}\`;
      this.lastChangeTime = new Date();

      // Solution: Emit action completion
      this.actionComplete.emit(this.actionResult);

      // Simulate some async work
      setTimeout(() => {
        this.actionResult += ' (completed)';
      }, 1000);

    } catch (error) {
      console.error('Error performing action:', error);
      this.actionResult = \`Error performing action: \${error.message}\`;
    }
  }

  reset(): void {
    try {
      this.internalValue = 'Child internal value';
      this.counter = 0;
      this.actionResult = 'Component reset';
      this.lastChangeTime = new Date();

      const emittedData: ChildEmittedData = {
        type: 'value_change',
        data: this.internalValue,
        timestamp: new Date()
      };

      this.dataChange.emit(emittedData);
    } catch (error) {
      console.error('Error resetting component:', error);
      this.actionResult = 'Error resetting component';
    }
  }

  private emitValueChange(value: string) {
    if (value.trim()) {
      const emittedData: ChildEmittedData = {
        type: 'value_change',
        data: value.trim(),
        timestamp: new Date()
      };

      this.dataChange.emit(emittedData);
    }
  }

  private isValidInputData(data: any): data is ChildData {
    return data &&
           typeof data === 'object' &&
           typeof data.name === 'string' &&
           typeof data.count === 'number';
  }
}`
    },
    testCases: [
      'Parent-child communication should handle data validation',
      'ViewChild access should be properly timed and error-handled',
      'Data mutations should create new objects for change detection',
      'Component communication should be structured and typed'
    ],
    debuggingSteps: [
      'Check ViewChild initialization timing',
      'Verify data mutation vs immutable updates',
      'Test error handling in component communication',
      'Validate data structure and typing'
    ],
    commonMistakes: [
      'Accessing ViewChild before AfterViewInit',
      'Mutating objects directly instead of creating new ones',
      'Not validating data in component communication',
      'Missing error handling in method calls'
    ],
    productionImpact: 'Component communication failures, data inconsistency, runtime errors',
    preventionTips: [
      'Always check ViewChild availability before use',
      'Use immutable data updates for change detection',
      'Validate all data in component communication',
      'Implement proper error handling and logging'
    ]
  },

  // ===== TEMPLATE-DRIVEN FORMS ISSUES (4 challenges) =====

  {
    id: 'angular-template-forms-validation',
    title: 'Template-Driven Forms Validation Issues',
    description: 'Problems with template-driven forms validation and error handling',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '19 min',
    xpReward: 135,
    tags: ['Angular', 'Template Forms', 'Validation', 'NgModel', 'Form Controls'],
    rootCause: 'Improper template-driven forms implementation and validation handling',
    category: 'Template-Driven Forms',
    files: {
      'user-form.component.ts': `import { Component } from '@angular/core';

interface User {
  name: string;
  email: string;
  age: number;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

@Component({
  selector: 'app-user-form',
  template: \`
    <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
      <div class="form-group">
        <label for="name">Name:</label>
        <!-- BUG: Missing required validation and error display! -->
        <input
          type="text"
          id="name"
          name="name"
          [(ngModel)]="user.name"
          #nameField="ngModel"
        >
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <!-- BUG: Missing email validation! -->
        <input
          type="email"
          id="email"
          name="email"
          [(ngModel)]="user.email"
          #emailField="ngModel"
        >
      </div>

      <div class="form-group">
        <label for="age">Age:</label>
        <!-- BUG: No min/max validation! -->
        <input
          type="number"
          id="age"
          name="age"
          [(ngModel)]="user.age"
          #ageField="ngModel"
        >
      </div>

      <div class="form-group">
        <label for="phone">Phone:</label>
        <!-- BUG: No pattern validation for phone! -->
        <input
          type="tel"
          id="phone"
          name="phone"
          [(ngModel)]="user.phone"
          #phoneField="ngModel"
        >
      </div>

      <!-- BUG: Nested object binding issues! -->
      <fieldset>
        <legend>Address</legend>

        <div class="form-group">
          <label for="street">Street:</label>
          <input
            type="text"
            id="street"
            name="street"
            [(ngModel)]="user.address.street"
            #streetField="ngModel"
          >
        </div>

        <div class="form-group">
          <label for="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            [(ngModel)]="user.address.city"
            #cityField="ngModel"
          >
        </div>

        <div class="form-group">
          <label for="zipCode">Zip Code:</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            [(ngModel)]="user.address.zipCode"
            #zipField="ngModel"
          >
        </div>
      </fieldset>

      <!-- BUG: No form validation status checking! -->
      <button type="submit">Submit</button>
      <button type="button" (click)="resetForm()">Reset</button>

      <!-- BUG: No error display! -->
    </form>

    <div class="debug-info">
      <h3>Debug Info</h3>
      <p>Form Valid: {{userForm.valid}}</p>
      <p>Form Submitted: {{userForm.submitted}}</p>
      <p>Form Touched: {{userForm.touched}}</p>
      <p>Form Dirty: {{userForm.dirty}}</p>
    </div>
  \`
})
export class UserFormComponent {
  user: User = {
    name: '',
    email: '',
    age: 0,
    phone: '',
    address: {
      street: '',
      city: '',
      zipCode: ''
    }
  };

  onSubmit(form: any) {
    // BUG: Not validating form before submission!
    console.log('Form submitted:', this.user);
    console.log('Form object:', form);
  }

  resetForm() {
    // BUG: Not properly resetting form state!
    this.user = {
      name: '',
      email: '',
      age: 0,
      phone: '',
      address: {
        street: '',
        city: '',
        zipCode: ''
      }
    };
  }
}`
    },
    hints: [
      'Add proper validation attributes and error display',
      'Handle nested object binding correctly',
      'Implement proper form state management',
      'Add comprehensive error messages'
    ],
    solution: {
      'user-form.component.ts': `import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

interface User {
  name: string;
  email: string;
  age: number;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

interface ValidationErrors {
  [key: string]: string[];
}

@Component({
  selector: 'app-user-form',
  template: \`
    <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)" novalidate>
      <div class="form-group">
        <label for="name">Name: <span class="required">*</span></label>
        <!-- Solution: Proper validation with error display -->
        <input
          type="text"
          id="name"
          name="name"
          [(ngModel)]="user.name"
          #nameField="ngModel"
          required
          minlength="2"
          maxlength="50"
          pattern="^[a-zA-Z\\s]+$"
          [class.error]="nameField.invalid && (nameField.dirty || nameField.touched)"
          placeholder="Enter your full name"
        >
        <div class="error-messages" *ngIf="nameField.invalid && (nameField.dirty || nameField.touched)">
          <small *ngIf="nameField.errors?.['required']">Name is required</small>
          <small *ngIf="nameField.errors?.['minlength']">Name must be at least 2 characters</small>
          <small *ngIf="nameField.errors?.['maxlength']">Name cannot exceed 50 characters</small>
          <small *ngIf="nameField.errors?.['pattern']">Name can only contain letters and spaces</small>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email: <span class="required">*</span></label>
        <!-- Solution: Email validation with custom pattern -->
        <input
          type="email"
          id="email"
          name="email"
          [(ngModel)]="user.email"
          #emailField="ngModel"
          required
          email
          maxlength="100"
          [class.error]="emailField.invalid && (emailField.dirty || emailField.touched)"
          placeholder="Enter your email address"
        >
        <div class="error-messages" *ngIf="emailField.invalid && (emailField.dirty || emailField.touched)">
          <small *ngIf="emailField.errors?.['required']">Email is required</small>
          <small *ngIf="emailField.errors?.['email']">Please enter a valid email address</small>
          <small *ngIf="emailField.errors?.['maxlength']">Email cannot exceed 100 characters</small>
        </div>
      </div>

      <div class="form-group">
        <label for="age">Age: <span class="required">*</span></label>
        <!-- Solution: Number validation with min/max -->
        <input
          type="number"
          id="age"
          name="age"
          [(ngModel)]="user.age"
          #ageField="ngModel"
          required
          min="18"
          max="120"
          [class.error]="ageField.invalid && (ageField.dirty || ageField.touched)"
          placeholder="Enter your age"
        >
        <div class="error-messages" *ngIf="ageField.invalid && (ageField.dirty || ageField.touched)">
          <small *ngIf="ageField.errors?.['required']">Age is required</small>
          <small *ngIf="ageField.errors?.['min']">Age must be at least 18</small>
          <small *ngIf="ageField.errors?.['max']">Age cannot exceed 120</small>
        </div>
      </div>

      <div class="form-group">
        <label for="phone">Phone: <span class="required">*</span></label>
        <!-- Solution: Phone pattern validation -->
        <input
          type="tel"
          id="phone"
          name="phone"
          [(ngModel)]="user.phone"
          #phoneField="ngModel"
          required
          pattern="^[\\+]?[1-9][\\d]{0,15}$"
          maxlength="20"
          [class.error]="phoneField.invalid && (phoneField.dirty || phoneField.touched)"
          placeholder="Enter your phone number"
        >
        <div class="error-messages" *ngIf="phoneField.invalid && (phoneField.dirty || phoneField.touched)">
          <small *ngIf="phoneField.errors?.['required']">Phone number is required</small>
          <small *ngIf="phoneField.errors?.['pattern']">Please enter a valid phone number</small>
          <small *ngIf="phoneField.errors?.['maxlength']">Phone number is too long</small>
        </div>
      </div>

      <!-- Solution: Proper nested object binding with ngModelGroup -->
      <fieldset>
        <legend>Address <span class="required">*</span></legend>

        <div ngModelGroup="address" #addressGroup="ngModelGroup">
          <div class="form-group">
            <label for="street">Street: <span class="required">*</span></label>
            <input
              type="text"
              id="street"
              name="street"
              [(ngModel)]="user.address.street"
              #streetField="ngModel"
              required
              minlength="5"
              maxlength="100"
              [class.error]="streetField.invalid && (streetField.dirty || streetField.touched)"
              placeholder="Enter street address"
            >
            <div class="error-messages" *ngIf="streetField.invalid && (streetField.dirty || streetField.touched)">
              <small *ngIf="streetField.errors?.['required']">Street address is required</small>
              <small *ngIf="streetField.errors?.['minlength']">Street address must be at least 5 characters</small>
              <small *ngIf="streetField.errors?.['maxlength']">Street address cannot exceed 100 characters</small>
            </div>
          </div>

          <div class="form-group">
            <label for="city">City: <span class="required">*</span></label>
            <input
              type="text"
              id="city"
              name="city"
              [(ngModel)]="user.address.city"
              #cityField="ngModel"
              required
              minlength="2"
              maxlength="50"
              pattern="^[a-zA-Z\\s\\-']+$"
              [class.error]="cityField.invalid && (cityField.dirty || cityField.touched)"
              placeholder="Enter city name"
            >
            <div class="error-messages" *ngIf="cityField.invalid && (cityField.dirty || cityField.touched)">
              <small *ngIf="cityField.errors?.['required']">City is required</small>
              <small *ngIf="cityField.errors?.['minlength']">City must be at least 2 characters</small>
              <small *ngIf="cityField.errors?.['maxlength']">City cannot exceed 50 characters</small>
              <small *ngIf="cityField.errors?.['pattern']">City can only contain letters, spaces, hyphens, and apostrophes</small>
            </div>
          </div>

          <div class="form-group">
            <label for="zipCode">Zip Code: <span class="required">*</span></label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              [(ngModel)]="user.address.zipCode"
              #zipField="ngModel"
              required
              pattern="^\\d{5}(-\\d{4})?$"
              [class.error]="zipField.invalid && (zipField.dirty || zipField.touched)"
              placeholder="Enter zip code (e.g., 12345 or 12345-6789)"
            >
            <div class="error-messages" *ngIf="zipField.invalid && (zipField.dirty || zipField.touched)">
              <small *ngIf="zipField.errors?.['required']">Zip code is required</small>
              <small *ngIf="zipField.errors?.['pattern']">Please enter a valid zip code (e.g., 12345 or 12345-6789)</small>
            </div>
          </div>
        </div>
      </fieldset>

      <!-- Solution: Form validation status checking -->
      <div class="form-actions">
        <button
          type="submit"
          [disabled]="userForm.invalid || isSubmitting"
          [class.loading]="isSubmitting">
          {{isSubmitting ? 'Submitting...' : 'Submit'}}
        </button>
        <button
          type="button"
          (click)="resetForm(userForm)"
          [disabled]="isSubmitting">
          Reset
        </button>
      </div>

      <!-- Solution: Comprehensive error display -->
      <div class="form-summary" *ngIf="userForm.submitted && userForm.invalid">
        <div class="error-summary">
          <h4>Please correct the following errors:</h4>
          <ul>
            <li *ngFor="let error of getFormErrors(userForm)">{{error}}</li>
          </ul>
        </div>
      </div>

      <!-- Solution: Success message -->
      <div class="success-message" *ngIf="submitSuccess">
        <p>Form submitted successfully!</p>
      </div>
    </form>

    <div class="debug-info" *ngIf="showDebugInfo">
      <h3>Debug Info</h3>
      <div class="debug-grid">
        <div>Form Valid: <span [class]="userForm.valid ? 'valid' : 'invalid'">{{userForm.valid}}</span></div>
        <div>Form Submitted: <span>{{userForm.submitted}}</span></div>
        <div>Form Touched: <span>{{userForm.touched}}</span></div>
        <div>Form Dirty: <span>{{userForm.dirty}}</span></div>
        <div>Form Pending: <span>{{userForm.pending}}</span></div>
      </div>

      <details>
        <summary>Form Value</summary>
        <pre>{{user | json}}</pre>
      </details>

      <details>
        <summary>Form Errors</summary>
        <pre>{{getFormErrors(userForm) | json}}</pre>
      </details>
    </div>

    <button type="button" (click)="toggleDebugInfo()" class="debug-toggle">
      {{showDebugInfo ? 'Hide' : 'Show'}} Debug Info
    </button>
  \`,
  styles: [\`
    .form-group {
      margin-bottom: 1rem;
    }

    .required {
      color: #e74c3c;
    }

    input.error {
      border-color: #e74c3c;
      background-color: #fdf2f2;
    }

    .error-messages {
      margin-top: 0.25rem;
    }

    .error-messages small {
      display: block;
      color: #e74c3c;
      font-size: 0.875rem;
    }

    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading {
      position: relative;
    }

    .error-summary {
      background-color: #fdf2f2;
      border: 1px solid #e74c3c;
      border-radius: 4px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .success-message {
      background-color: #f0f9f0;
      border: 1px solid #27ae60;
      border-radius: 4px;
      padding: 1rem;
      margin-top: 1rem;
      color: #27ae60;
    }

    .debug-info {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .debug-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .valid {
      color: #27ae60;
      font-weight: bold;
    }

    .invalid {
      color: #e74c3c;
      font-weight: bold;
    }

    fieldset {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    legend {
      padding: 0 0.5rem;
      font-weight: bold;
    }
  \`]
})
export class UserFormComponent {
  @ViewChild('userForm') userFormRef!: NgForm;

  user: User = {
    name: '',
    email: '',
    age: 18,
    phone: '',
    address: {
      street: '',
      city: '',
      zipCode: ''
    }
  };

  isSubmitting = false;
  submitSuccess = false;
  showDebugInfo = false;

  async onSubmit(form: NgForm) {
    // Solution: Proper form validation before submission
    if (form.invalid) {
      console.log('Form is invalid, marking all fields as touched');
      this.markAllFieldsAsTouched(form);
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;

    try {
      // Simulate API call
      await this.submitUserData(this.user);

      console.log('Form submitted successfully:', this.user);
      this.submitSuccess = true;

      // Reset form after successful submission
      setTimeout(() => {
        this.resetForm(form);
        this.submitSuccess = false;
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle submission error
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm(form?: NgForm) {
    // Solution: Properly reset form state and model
    this.user = {
      name: '',
      email: '',
      age: 18,
      phone: '',
      address: {
        street: '',
        city: '',
        zipCode: ''
      }
    };

    if (form) {
      form.resetForm();
      // Reset custom states
      this.submitSuccess = false;
    }
  }

  private async submitUserData(userData: User): Promise<void> {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate occasional API errors
        if (Math.random() < 0.1) {
          reject(new Error('API Error: Unable to submit user data'));
        } else {
          resolve();
        }
      }, 2000);
    });
  }

  private markAllFieldsAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  getFormErrors(form: NgForm): string[] {
    const errors: string[] = [];

    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      if (control.invalid && (control.dirty || control.touched)) {
        const fieldName = this.getFieldDisplayName(key);

        if (control.errors?.['required']) {
          errors.push(\`\${fieldName} is required\`);
        }
        if (control.errors?.['email']) {
          errors.push(\`\${fieldName} must be a valid email address\`);
        }
        if (control.errors?.['minlength']) {
          errors.push(\`\${fieldName} is too short\`);
        }
        if (control.errors?.['maxlength']) {
          errors.push(\`\${fieldName} is too long\`);
        }
        if (control.errors?.['pattern']) {
          errors.push(\`\${fieldName} format is invalid\`);
        }
        if (control.errors?.['min']) {
          errors.push(\`\${fieldName} value is too low\`);
        }
        if (control.errors?.['max']) {
          errors.push(\`\${fieldName} value is too high\`);
        }
      }
    });

    return errors;
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'name': 'Name',
      'email': 'Email',
      'age': 'Age',
      'phone': 'Phone',
      'street': 'Street Address',
      'city': 'City',
      'zipCode': 'Zip Code'
    };

    return displayNames[fieldName] || fieldName;
  }

  toggleDebugInfo() {
    this.showDebugInfo = !this.showDebugInfo;
  }

  // Solution: Additional utility methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userFormRef?.controls[fieldName];
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldErrors(fieldName: string): string[] {
    const field = this.userFormRef?.controls[fieldName];
    if (!field || !field.errors) return [];

    return Object.keys(field.errors).map(errorKey => {
      const fieldDisplayName = this.getFieldDisplayName(fieldName);
      switch (errorKey) {
        case 'required': return \`\${fieldDisplayName} is required\`;
        case 'email': return \`\${fieldDisplayName} must be a valid email\`;
        case 'minlength': return \`\${fieldDisplayName} is too short\`;
        case 'maxlength': return \`\${fieldDisplayName} is too long\`;
        case 'pattern': return \`\${fieldDisplayName} format is invalid\`;
        case 'min': return \`\${fieldDisplayName} value is too low\`;
        case 'max': return \`\${fieldDisplayName} value is too high\`;
        default: return \`\${fieldDisplayName} is invalid\`;
      }
    });
  }
}`
    },
    testCases: [
      'Template-driven forms should validate all fields properly',
      'Nested object binding should work with ngModelGroup',
      'Error messages should display for invalid fields',
      'Form submission should be prevented when invalid'
    ],
    debuggingSteps: [
      'Check form validation attributes and error display',
      'Verify nested object binding with ngModelGroup',
      'Test form state management and reset functionality',
      'Validate error handling and user feedback'
    ],
    commonMistakes: [
      'Missing validation attributes on form fields',
      'Not handling nested object binding properly',
      'Poor error message display and user feedback',
      'Not validating form before submission'
    ],
    productionImpact: 'Invalid data submission, poor user experience, form validation failures',
    preventionTips: [
      'Always add proper validation attributes',
      'Use ngModelGroup for nested object binding',
      'Implement comprehensive error display',
      'Validate forms before allowing submission'
    ]
  },

  // ===== PIPE DEBUGGING ISSUES (4 challenges) =====

  {
    id: 'angular-custom-pipe-issues',
    title: 'Custom Pipe Implementation Issues',
    description: 'Problems with custom pipe creation, pure/impure pipes, and performance',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['Angular', 'Pipes', 'Custom Pipes', 'Pure Pipes', 'Impure Pipes', 'Performance'],
    rootCause: 'Incorrect pipe implementation and misunderstanding of pure vs impure pipes',
    category: 'Pipe Debugging',
    files: {
      'currency-format.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

// BUG: Not specifying pure/impure behavior correctly!
@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  // BUG: Not handling edge cases!
  transform(value: any, currency: string = 'USD', locale: string = 'en-US'): string {
    // BUG: No input validation!
    const numericValue = parseFloat(value);

    // BUG: Not handling NaN or invalid values!
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(numericValue);
  }
}`,
      'search-filter.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

// BUG: Should be impure for array filtering but marked as pure!
@Pipe({
  name: 'searchFilter',
  pure: true // BUG: This should be false for array operations!
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], searchTerm: string, searchFields: string[] = []): any[] {
    // BUG: Not handling null/undefined inputs!
    if (!searchTerm) {
      return items;
    }

    // BUG: Case-sensitive search!
    return items.filter(item => {
      // BUG: Not handling nested properties!
      return searchFields.some(field =>
        item[field] && item[field].includes(searchTerm)
      );
    });
  }
}`,
      'date-ago.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo'
  // BUG: Missing pure property - defaults to true but should be false for time-based pipes!
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any): string {
    // BUG: No input validation!
    const date = new Date(value);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    // BUG: Not handling future dates!
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // BUG: Incomplete time calculations!
    if (diffInMinutes < 1) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return \`\${diffInMinutes} minutes ago\`;
    } else if (diffInHours < 24) {
      return \`\${diffInHours} hours ago\`;
    } else {
      return \`\${diffInDays} days ago\`;
    }
  }
}`,
      'app.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <div class="container">
      <h2>Pipe Debugging Examples</h2>

      <div class="section">
        <h3>Currency Formatting</h3>
        <!-- BUG: Not handling invalid values! -->
        <p>Price 1: {{ price1 | currencyFormat }}</p>
        <p>Price 2: {{ price2 | currencyFormat:'EUR':'de-DE' }}</p>
        <p>Invalid Price: {{ invalidPrice | currencyFormat }}</p>
      </div>

      <div class="section">
        <h3>Search Filter</h3>
        <input [(ngModel)]="searchTerm" placeholder="Search users...">

        <!-- BUG: Filter not updating when array changes! -->
        <div *ngFor="let user of users | searchFilter:searchTerm:['name', 'email']">
          <p>{{user.name}} - {{user.email}}</p>
        </div>

        <button (click)="addUser()">Add User</button>
        <button (click)="updateUser()">Update First User</button>
      </div>

      <div class="section">
        <h3>Date Ago</h3>
        <!-- BUG: Not updating automatically! -->
        <p>Post 1: {{ post1Date | dateAgo }}</p>
        <p>Post 2: {{ post2Date | dateAgo }}</p>
        <p>Future Date: {{ futureDate | dateAgo }}</p>
      </div>
    </div>
  \`
})
export class AppComponent {
  price1 = 1234.56;
  price2 = 999.99;
  invalidPrice = 'not-a-number'; // BUG: This will cause issues!

  searchTerm = '';
  users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' }
  ];

  post1Date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
  post2Date = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
  futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours in future

  addUser() {
    // BUG: Array mutation won't trigger pure pipe update!
    this.users.push({
      name: \`User \${this.users.length + 1}\`,
      email: \`user\${this.users.length + 1}@example.com\`
    });
  }

  updateUser() {
    // BUG: Object mutation won't trigger pure pipe update!
    this.users[0].name = 'Updated Name';
  }
}`
    },
    hints: [
      'Understand the difference between pure and impure pipes',
      'Add proper input validation to pipes',
      'Handle edge cases and invalid inputs',
      'Consider performance implications of impure pipes'
    ],
    solution: {
      'currency-format.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

// Solution: Properly configured pure pipe
@Pipe({
  name: 'currencyFormat',
  pure: true // Pure pipe is appropriate for currency formatting
})
export class CurrencyFormatPipe implements PipeTransform {

  private supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  private supportedLocales = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'ja-JP'];

  transform(
    value: any,
    currency: string = 'USD',
    locale: string = 'en-US',
    minimumFractionDigits?: number,
    maximumFractionDigits?: number
  ): string {

    // Solution: Comprehensive input validation
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Convert to number
    let numericValue: number;

    if (typeof value === 'string') {
      // Remove currency symbols and spaces for parsing
      const cleanValue = value.replace(/[^\\d.-]/g, '');
      numericValue = parseFloat(cleanValue);
    } else {
      numericValue = Number(value);
    }

    // Solution: Handle invalid numeric values
    if (isNaN(numericValue)) {
      console.warn(\`CurrencyFormatPipe: Invalid numeric value '\${value}'\`);
      return 'Invalid Amount';
    }

    // Solution: Validate currency code
    if (!this.supportedCurrencies.includes(currency.toUpperCase())) {
      console.warn(\`CurrencyFormatPipe: Unsupported currency '\${currency}', falling back to USD\`);
      currency = 'USD';
    }

    // Solution: Validate locale
    if (!this.supportedLocales.includes(locale)) {
      console.warn(\`CurrencyFormatPipe: Unsupported locale '\${locale}', falling back to en-US\`);
      locale = 'en-US';
    }

    try {
      // Solution: Proper formatting with options
      const formatOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currency.toUpperCase()
      };

      if (minimumFractionDigits !== undefined) {
        formatOptions.minimumFractionDigits = Math.max(0, Math.min(20, minimumFractionDigits));
      }

      if (maximumFractionDigits !== undefined) {
        formatOptions.maximumFractionDigits = Math.max(0, Math.min(20, maximumFractionDigits));
      }

      return new Intl.NumberFormat(locale, formatOptions).format(numericValue);
    } catch (error) {
      console.error('CurrencyFormatPipe: Formatting error', error);
      return \`\${numericValue} \${currency.toUpperCase()}\`;
    }
  }
}`,
      'search-filter.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

// Solution: Impure pipe for array filtering
@Pipe({
  name: 'searchFilter',
  pure: false // Solution: Impure pipe to detect array changes
})
export class SearchFilterPipe implements PipeTransform {

  transform(
    items: any[],
    searchTerm: string,
    searchFields: string[] = [],
    caseSensitive: boolean = false,
    exactMatch: boolean = false
  ): any[] {

    // Solution: Handle null/undefined inputs
    if (!items || !Array.isArray(items)) {
      console.warn('SearchFilterPipe: Items must be an array');
      return [];
    }

    if (!searchTerm || searchTerm.trim() === '') {
      return items;
    }

    if (!searchFields || searchFields.length === 0) {
      console.warn('SearchFilterPipe: No search fields specified');
      return items;
    }

    const normalizedSearchTerm = caseSensitive
      ? searchTerm.trim()
      : searchTerm.trim().toLowerCase();

    return items.filter(item => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      return searchFields.some(field => {
        const fieldValue = this.getNestedProperty(item, field);

        if (fieldValue === null || fieldValue === undefined) {
          return false;
        }

        const stringValue = String(fieldValue);
        const normalizedFieldValue = caseSensitive
          ? stringValue
          : stringValue.toLowerCase();

        // Solution: Support exact match or partial match
        if (exactMatch) {
          return normalizedFieldValue === normalizedSearchTerm;
        } else {
          return normalizedFieldValue.includes(normalizedSearchTerm);
        }
      });
    });
  }

  // Solution: Handle nested properties
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => {
      return current && current[prop] !== undefined ? current[prop] : null;
    }, obj);
  }
}`,
      'date-ago.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

// Solution: Impure pipe for time-based calculations
@Pipe({
  name: 'dateAgo',
  pure: false // Solution: Impure pipe to update automatically
})
export class DateAgoPipe implements PipeTransform {

  transform(
    value: any,
    maxUnit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' = 'year',
    showFuture: boolean = true
  ): string {

    // Solution: Comprehensive input validation
    if (value === null || value === undefined || value === '') {
      return '';
    }

    let date: Date;

    // Handle different input types
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string' || typeof value === 'number') {
      date = new Date(value);
    } else {
      console.warn(\`DateAgoPipe: Invalid date value '\${value}'\`);
      return 'Invalid Date';
    }

    // Solution: Validate date
    if (isNaN(date.getTime())) {
      console.warn(\`DateAgoPipe: Invalid date '\${value}'\`);
      return 'Invalid Date';
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const isFuture = diffInMs < 0;
    const absDiffInMs = Math.abs(diffInMs);

    // Solution: Handle future dates
    if (isFuture && !showFuture) {
      return 'Future Date';
    }

    // Calculate time units
    const diffInSeconds = Math.floor(absDiffInMs / 1000);
    const diffInMinutes = Math.floor(absDiffInMs / (1000 * 60));
    const diffInHours = Math.floor(absDiffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(absDiffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    const suffix = isFuture ? 'from now' : 'ago';
    const prefix = isFuture ? 'in ' : '';

    // Solution: Complete time calculations with max unit support
    if (diffInSeconds < 30) {
      return isFuture ? 'in a moment' : 'just now';
    }

    if (diffInSeconds < 60 && this.shouldShowUnit('second', maxUnit)) {
      return \`\${prefix}\${diffInSeconds} second\${diffInSeconds !== 1 ? 's' : ''} \${suffix}\`;
    }

    if (diffInMinutes < 60 && this.shouldShowUnit('minute', maxUnit)) {
      return \`\${prefix}\${diffInMinutes} minute\${diffInMinutes !== 1 ? 's' : ''} \${suffix}\`;
    }

    if (diffInHours < 24 && this.shouldShowUnit('hour', maxUnit)) {
      return \`\${prefix}\${diffInHours} hour\${diffInHours !== 1 ? 's' : ''} \${suffix}\`;
    }

    if (diffInDays < 7 && this.shouldShowUnit('day', maxUnit)) {
      return \`\${prefix}\${diffInDays} day\${diffInDays !== 1 ? 's' : ''} \${suffix}\`;
    }

    if (diffInWeeks < 4 && this.shouldShowUnit('week', maxUnit)) {
      return \`\${prefix}\${diffInWeeks} week\${diffInWeeks !== 1 ? 's' : ''} \${suffix}\`;
    }

    if (diffInMonths < 12 && this.shouldShowUnit('month', maxUnit)) {
      return \`\${prefix}\${diffInMonths} month\${diffInMonths !== 1 ? 's' : ''} \${suffix}\`;
    }

    if (this.shouldShowUnit('year', maxUnit)) {
      return \`\${prefix}\${diffInYears} year\${diffInYears !== 1 ? 's' : ''} \${suffix}\`;
    }

    // Fallback to formatted date if max unit is restrictive
    return date.toLocaleDateString();
  }

  private shouldShowUnit(unit: string, maxUnit: string): boolean {
    const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
    const unitIndex = units.indexOf(unit);
    const maxUnitIndex = units.indexOf(maxUnit);
    return unitIndex <= maxUnitIndex;
  }
}`,
      'app.component.ts': `import { Component, OnInit, OnDestroy } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  department?: string;
}

@Component({
  selector: 'app-root',
  template: \`
    <div class="container">
      <h2>Pipe Debugging Examples - Fixed</h2>

      <div class="section">
        <h3>Currency Formatting</h3>
        <div class="examples">
          <p>Valid Price 1: {{ price1 | currencyFormat }}</p>
          <p>Valid Price 2: {{ price2 | currencyFormat:'EUR':'de-DE' }}</p>
          <p>String Price: {{ stringPrice | currencyFormat:'GBP':'en-GB' }}</p>
          <p>Invalid Price: {{ invalidPrice | currencyFormat }}</p>
          <p>Null Price: {{ nullPrice | currencyFormat }}</p>
          <p>Custom Decimals: {{ price1 | currencyFormat:'USD':'en-US':0:0 }}</p>
        </div>
      </div>

      <div class="section">
        <h3>Search Filter (Impure Pipe)</h3>
        <div class="controls">
          <input
            [(ngModel)]="searchTerm"
            placeholder="Search users..."
            class="search-input"
          >
          <label>
            <input type="checkbox" [(ngModel)]="caseSensitive"> Case Sensitive
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="exactMatch"> Exact Match
          </label>
        </div>

        <!-- Solution: Now properly updates with array changes -->
        <div class="user-list">
          <div
            *ngFor="let user of users | searchFilter:searchTerm:searchFields:caseSensitive:exactMatch; trackBy: trackByUserId"
            class="user-item"
          >
            <strong>{{user.name}}</strong> - {{user.email}}
            <span *ngIf="user.department"> ({{user.department}})</span>
          </div>
        </div>

        <div class="controls">
          <button (click)="addUser()" class="btn">Add User</button>
          <button (click)="updateUser()" class="btn">Update First User</button>
          <button (click)="removeUser()" class="btn" [disabled]="users.length === 0">Remove Last User</button>
        </div>

        <p class="info">
          Showing {{(users | searchFilter:searchTerm:searchFields:caseSensitive:exactMatch).length}}
          of {{users.length}} users
        </p>
      </div>

      <div class="section">
        <h3>Date Ago (Impure Pipe - Auto Updates)</h3>
        <div class="examples">
          <p>Recent Post: {{ recentPost | dateAgo }}</p>
          <p>Old Post: {{ oldPost | dateAgo }}</p>
          <p>Future Event: {{ futureDate | dateAgo:true }}</p>
          <p>Very Old: {{ veryOldDate | dateAgo:'day' }}</p>
          <p>Current Time: {{ currentTime | dateAgo }}</p>
        </div>

        <div class="controls">
          <button (click)="updateCurrentTime()" class="btn">Update Current Time</button>
          <button (click)="addRecentPost()" class="btn">Add Recent Post</button>
        </div>
      </div>

      <div class="section">
        <h3>Performance Monitor</h3>
        <p>Pipe Transform Count: {{transformCount}}</p>
        <p>Last Update: {{lastUpdate | date:'medium'}}</p>
      </div>
    </div>
  \`,
  styles: [\`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .examples p {
      margin: 8px 0;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .controls {
      margin: 15px 0;
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      min-width: 200px;
    }

    .btn {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn:hover {
      background-color: #0056b3;
    }

    .btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .user-list {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 4px;
    }

    .user-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }

    .user-item:last-child {
      border-bottom: none;
    }

    .info {
      font-style: italic;
      color: #666;
    }

    label {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  \`]
})
export class AppComponent implements OnInit, OnDestroy {
  // Currency examples
  price1 = 1234.56;
  price2 = 999.99;
  stringPrice = '1,500.75';
  invalidPrice = 'not-a-number';
  nullPrice = null;

  // Search filter examples
  searchTerm = '';
  caseSensitive = false;
  exactMatch = false;
  searchFields = ['name', 'email', 'department'];

  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', department: 'Engineering' }
  ];

  // Date examples
  recentPost = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
  oldPost = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
  futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours in future
  veryOldDate = new Date('2020-01-01');
  currentTime = new Date();

  // Performance monitoring
  transformCount = 0;
  lastUpdate = new Date();

  private updateInterval: any;
  private userIdCounter = 5;

  ngOnInit() {
    // Solution: Update current time periodically to show impure pipe updates
    this.updateInterval = setInterval(() => {
      this.currentTime = new Date();
      this.lastUpdate = new Date();
      this.transformCount++;
    }, 10000); // Update every 10 seconds
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  addUser() {
    // Solution: Create new array reference for change detection
    const newUser: User = {
      id: this.userIdCounter++,
      name: \`User \${this.userIdCounter - 1}\`,
      email: \`user\${this.userIdCounter - 1}@example.com\`,
      department: ['Engineering', 'Marketing', 'Sales'][Math.floor(Math.random() * 3)]
    };

    this.users = [...this.users, newUser];
  }

  updateUser() {
    if (this.users.length > 0) {
      // Solution: Create new array with updated object
      this.users = this.users.map((user, index) =>
        index === 0
          ? { ...user, name: \`Updated \${user.name}\`, department: 'Updated Dept' }
          : user
      );
    }
  }

  removeUser() {
    if (this.users.length > 0) {
      // Solution: Create new array without last user
      this.users = this.users.slice(0, -1);
    }
  }

  updateCurrentTime() {
    this.currentTime = new Date();
    this.transformCount++;
  }

  addRecentPost() {
    this.recentPost = new Date();
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}`
    },
    testCases: [
      'Pure pipes should not update when array contents change',
      'Impure pipes should update when array contents change',
      'Pipes should handle invalid input gracefully',
      'Date pipes should update automatically over time'
    ],
    debuggingSteps: [
      'Test pipe behavior with pure vs impure configuration',
      'Verify input validation and error handling',
      'Check performance impact of impure pipes',
      'Test edge cases and invalid inputs'
    ],
    commonMistakes: [
      'Using pure pipes for array filtering operations',
      'Not validating pipe inputs properly',
      'Missing error handling for invalid data',
      'Not understanding performance implications'
    ],
    productionImpact: 'UI not updating, performance issues, runtime errors, poor user experience',
    preventionTips: [
      'Use impure pipes for array operations and time-based calculations',
      'Always validate pipe inputs and handle edge cases',
      'Consider performance implications of impure pipes',
      'Provide meaningful error messages for invalid inputs'
    ]
  },

  // ===== STATE MANAGEMENT ISSUES (4 challenges) =====

  {
    id: 'angular-ngrx-state-issues',
    title: 'NgRx State Management Problems',
    description: 'Common issues with NgRx store, actions, reducers, and effects',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['Angular', 'NgRx', 'State Management', 'Redux', 'Effects', 'Selectors'],
    rootCause: 'Improper NgRx implementation and state mutation issues',
    category: 'State Management',
    files: {
      'user.actions.ts': `import { createAction, props } from '@ngrx/store';

// BUG: Actions not following naming conventions!
export const getUsers = createAction('[User] Get Users');

export const getUsersSuccess = createAction(
  '[User] Get Users Success',
  props<{ users: any[] }>() // BUG: Using 'any' type!
);

export const getUsersFailure = createAction(
  '[User] Get Users Failure',
  props<{ error: string }>()
);

// BUG: Missing action for loading state!

export const updateUser = createAction(
  '[User] Update User',
  props<{ user: any }>() // BUG: Using 'any' type!
);

// BUG: No success/failure actions for update!

export const deleteUser = createAction(
  '[User] Delete User',
  props<{ id: string }>()
);

// BUG: Action payload structure inconsistent!
export const addUser = createAction(
  '[User] Add User',
  props<{ name: string; email: string }>() // BUG: Different structure than other actions!
);`,
      'user.reducer.ts': `import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

// BUG: Interface not properly defined!
interface UserState {
  users: any[]; // BUG: Using 'any' type!
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,

  on(UserActions.getUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.getUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users: users // BUG: Direct assignment without validation!
  })),

  on(UserActions.getUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // BUG: State mutation instead of immutable update!
  on(UserActions.updateUser, (state, { user }) => {
    const index = state.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      state.users[index] = user; // BUG: Mutating state directly!
    }
    return state; // BUG: Returning mutated state!
  }),

  // BUG: Not handling non-existent user!
  on(UserActions.deleteUser, (state, { id }) => ({
    ...state,
    users: state.users.filter(user => user.id !== id)
  })),

  // BUG: Not generating proper ID for new user!
  on(UserActions.addUser, (state, { name, email }) => ({
    ...state,
    users: [...state.users, { name, email }] // BUG: Missing ID and other properties!
  }))
);`,
      'user.effects.ts': `import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  // BUG: Using mergeMap instead of switchMap for GET requests!
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUsers),
      mergeMap(() => // BUG: Should use switchMap to cancel previous requests!
        this.userService.getUsers().pipe(
          map(users => UserActions.getUsersSuccess({ users })),
          catchError(error => of(UserActions.getUsersFailure({ error: error.message })))
        )
      )
    )
  );

  // BUG: No effect for update user!
  // BUG: No effect for add user!
  // BUG: No effect for delete user!

  // BUG: Missing error handling and loading states!
}`,
      'user.selectors.ts': `import { createFeatureSelector, createSelector } from '@ngrx/store';

// BUG: Not properly typed!
const selectUserState = createFeatureSelector<any>('user');

// BUG: No memoization consideration!
export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectUserState,
  (state) => state.error
);

// BUG: Inefficient selector - creates new array every time!
export const selectActiveUsers = createSelector(
  selectUsers,
  (users) => users.filter(user => user.active) // BUG: No null check!
);

// BUG: No selector for specific user by ID!
// BUG: No computed selectors for derived data!`,
      'user.component.ts': `import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as UserActions from './user.actions';
import * as UserSelectors from './user.selectors';

@Component({
  selector: 'app-user',
  template: \`
    <div class="user-container">
      <h2>User Management</h2>

      <!-- BUG: No loading indicator! -->
      <div *ngIf="loading$ | async">Loading...</div>

      <!-- BUG: No error handling display! -->
      <div *ngIf="error$ | async as error" class="error">
        Error: {{error}}
      </div>

      <div class="user-list">
        <!-- BUG: No trackBy function! -->
        <div *ngFor="let user of users$ | async" class="user-item">
          <span>{{user.name}} - {{user.email}}</span>
          <button (click)="updateUser(user)">Update</button>
          <button (click)="deleteUser(user.id)">Delete</button>
        </div>
      </div>

      <div class="add-user">
        <input [(ngModel)]="newUserName" placeholder="Name">
        <input [(ngModel)]="newUserEmail" placeholder="Email">
        <button (click)="addUser()">Add User</button>
      </div>
    </div>
  \`
})
export class UserComponent implements OnInit {
  users$: Observable<any[]>; // BUG: Using 'any' type!
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  newUserName = '';
  newUserEmail = '';

  constructor(private store: Store) {
    this.users$ = this.store.select(UserSelectors.selectUsers);
    this.loading$ = this.store.select(UserSelectors.selectLoading);
    this.error$ = this.store.select(UserSelectors.selectError);
  }

  ngOnInit() {
    // BUG: Dispatching action without checking if data already exists!
    this.store.dispatch(UserActions.getUsers());
  }

  updateUser(user: any) {
    // BUG: No validation or user input!
    const updatedUser = { ...user, name: user.name + ' (Updated)' };
    this.store.dispatch(UserActions.updateUser({ user: updatedUser }));
  }

  deleteUser(id: string) {
    // BUG: No confirmation dialog!
    this.store.dispatch(UserActions.deleteUser({ id }));
  }

  addUser() {
    // BUG: No input validation!
    if (this.newUserName && this.newUserEmail) {
      this.store.dispatch(UserActions.addUser({
        name: this.newUserName,
        email: this.newUserEmail
      }));

      // BUG: Clearing form without waiting for success!
      this.newUserName = '';
      this.newUserEmail = '';
    }
  }
}`
    },
    hints: [
      'Follow NgRx best practices for actions, reducers, and effects',
      'Use proper TypeScript interfaces for type safety',
      'Implement immutable state updates',
      'Add proper error handling and loading states'
    ],
    solution: {
      'user.actions.ts': `import { createAction, props } from '@ngrx/store';

// Solution: Proper TypeScript interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  id: string;
  changes: Partial<Omit<User, 'id' | 'createdAt'>>;
}

// Solution: Consistent action naming and structure
export const loadUsers = createAction('[User/API] Load Users');

export const loadUsersSuccess = createAction(
  '[User/API] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[User/API] Load Users Failure',
  props<{ error: string }>()
);

// Solution: Complete CRUD actions with loading states
export const createUser = createAction(
  '[User/API] Create User',
  props<{ user: CreateUserRequest }>()
);

export const createUserSuccess = createAction(
  '[User/API] Create User Success',
  props<{ user: User }>()
);

export const createUserFailure = createAction(
  '[User/API] Create User Failure',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[User/API] Update User',
  props<{ update: UpdateUserRequest }>()
);

export const updateUserSuccess = createAction(
  '[User/API] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[User/API] Update User Failure',
  props<{ error: string }>()
);

export const deleteUser = createAction(
  '[User/API] Delete User',
  props<{ id: string }>()
);

export const deleteUserSuccess = createAction(
  '[User/API] Delete User Success',
  props<{ id: string }>()
);

export const deleteUserFailure = createAction(
  '[User/API] Delete User Failure',
  props<{ error: string }>()
);

// Solution: UI actions separate from API actions
export const selectUser = createAction(
  '[User/UI] Select User',
  props<{ userId: string }>()
);

export const clearSelectedUser = createAction('[User/UI] Clear Selected User');

export const clearError = createAction('[User/UI] Clear Error');`,
      'user.reducer.ts': `import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as UserActions from './user.actions';
import { User } from './user.actions';

// Solution: Proper state interface with entity adapter
export interface UserState extends EntityState<User> {
  loading: boolean;
  error: string | null;
  selectedUserId: string | null;
  lastUpdated: Date | null;
}

// Solution: Entity adapter for normalized state
export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id,
  sortComparer: (a: User, b: User) => a.name.localeCompare(b.name)
});

const initialState: UserState = userAdapter.getInitialState({
  loading: false,
  error: null,
  selectedUserId: null,
  lastUpdated: null
});

export const userReducer = createReducer(
  initialState,

  // Solution: Load users actions
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUsersSuccess, (state, { users }) =>
    userAdapter.setAll(users, {
      ...state,
      loading: false,
      error: null,
      lastUpdated: new Date()
    })
  ),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Solution: Create user actions
  on(UserActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.createUserSuccess, (state, { user }) =>
    userAdapter.addOne(user, {
      ...state,
      loading: false,
      error: null,
      lastUpdated: new Date()
    })
  ),

  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Solution: Update user actions with immutable updates
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserSuccess, (state, { user }) =>
    userAdapter.updateOne(
      { id: user.id, changes: user },
      {
        ...state,
        loading: false,
        error: null,
        lastUpdated: new Date()
      }
    )
  ),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Solution: Delete user actions
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.deleteUserSuccess, (state, { id }) =>
    userAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
      selectedUserId: state.selectedUserId === id ? null : state.selectedUserId,
      lastUpdated: new Date()
    })
  ),

  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Solution: UI actions
  on(UserActions.selectUser, (state, { userId }) => ({
    ...state,
    selectedUserId: userId
  })),

  on(UserActions.clearSelectedUser, (state) => ({
    ...state,
    selectedUserId: null
  })),

  on(UserActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);

// Solution: Export entity selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = userAdapter.getSelectors();`,
      'user.effects.ts': `import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, EMPTY } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  switchMap,
  concatMap,
  withLatestFrom,
  filter,
  tap,
  debounceTime
} from 'rxjs/operators';
import { UserService } from './user.service';
import * as UserActions from './user.actions';
import * as UserSelectors from './user.selectors';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private store: Store,
    private userService: UserService
  ) {}

  // Solution: Use switchMap for GET requests to cancel previous requests
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      withLatestFrom(this.store.select(UserSelectors.selectLastUpdated)),
      filter(([action, lastUpdated]) => {
        // Solution: Avoid unnecessary API calls if data is fresh
        if (lastUpdated) {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          return lastUpdated < fiveMinutesAgo;
        }
        return true;
      }),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map(users => UserActions.loadUsersSuccess({ users })),
          catchError(error => {
            console.error('Load users error:', error);
            return of(UserActions.loadUsersFailure({
              error: this.getErrorMessage(error)
            }));
          })
        )
      )
    )
  );

  // Solution: Use concatMap for create operations to maintain order
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      concatMap(({ user }) =>
        this.userService.createUser(user).pipe(
          map(createdUser => UserActions.createUserSuccess({ user: createdUser })),
          catchError(error => {
            console.error('Create user error:', error);
            return of(UserActions.createUserFailure({
              error: this.getErrorMessage(error)
            }));
          })
        )
      )
    )
  );

  // Solution: Use concatMap for update operations
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      concatMap(({ update }) =>
        this.userService.updateUser(update.id, update.changes).pipe(
          map(updatedUser => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => {
            console.error('Update user error:', error);
            return of(UserActions.updateUserFailure({
              error: this.getErrorMessage(error)
            }));
          })
        )
      )
    )
  );

  // Solution: Use concatMap for delete operations
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      concatMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(() => UserActions.deleteUserSuccess({ id })),
          catchError(error => {
            console.error('Delete user error:', error);
            return of(UserActions.deleteUserFailure({
              error: this.getErrorMessage(error)
            }));
          })
        )
      )
    )
  );

  // Solution: Success notification effects
  createUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUserSuccess),
      tap(({ user }) => {
        console.log(\`User created successfully: \${user.name}\`);
        // Could dispatch a notification action here
      })
    ),
    { dispatch: false }
  );

  updateUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserSuccess),
      tap(({ user }) => {
        console.log(\`User updated successfully: \${user.name}\`);
      })
    ),
    { dispatch: false }
  );

  deleteUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUserSuccess),
      tap(({ id }) => {
        console.log(\`User deleted successfully: \${id}\`);
      })
    ),
    { dispatch: false }
  );

  // Solution: Error logging effect
  userErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.loadUsersFailure,
        UserActions.createUserFailure,
        UserActions.updateUserFailure,
        UserActions.deleteUserFailure
      ),
      tap(({ error }) => {
        console.error('User operation failed:', error);
        // Could dispatch analytics or monitoring actions here
      })
    ),
    { dispatch: false }
  );

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return 'An unexpected error occurred';
    }
  }
}`,
      'user.selectors.ts': `import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, selectAll, selectEntities, selectIds, selectTotal } from './user.reducer';

// Solution: Properly typed feature selector
export const selectUserState = createFeatureSelector<UserState>('user');

// Solution: Entity selectors
export const selectAllUsers = createSelector(selectUserState, selectAll);
export const selectUserEntities = createSelector(selectUserState, selectEntities);
export const selectUserIds = createSelector(selectUserState, selectIds);
export const selectUsersTotal = createSelector(selectUserState, selectTotal);

// Solution: Basic state selectors
export const selectUsersLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUsersError = createSelector(
  selectUserState,
  (state) => state.error
);

export const selectSelectedUserId = createSelector(
  selectUserState,
  (state) => state.selectedUserId
);

export const selectLastUpdated = createSelector(
  selectUserState,
  (state) => state.lastUpdated
);

// Solution: Computed selectors with proper memoization
export const selectActiveUsers = createSelector(
  selectAllUsers,
  (users) => users.filter(user => user.active)
);

export const selectInactiveUsers = createSelector(
  selectAllUsers,
  (users) => users.filter(user => !user.active)
);

// Solution: Selector for specific user by ID
export const selectUserById = (userId: string) => createSelector(
  selectUserEntities,
  (entities) => entities[userId]
);

// Solution: Selected user selector
export const selectSelectedUser = createSelector(
  selectUserEntities,
  selectSelectedUserId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Solution: Derived data selectors
export const selectUsersCount = createSelector(
  selectAllUsers,
  (users) => users.length
);

export const selectActiveUsersCount = createSelector(
  selectActiveUsers,
  (activeUsers) => activeUsers.length
);

export const selectUsersByDomain = createSelector(
  selectAllUsers,
  (users) => {
    const domains: { [domain: string]: number } = {};
    users.forEach(user => {
      const domain = user.email.split('@')[1];
      domains[domain] = (domains[domain] || 0) + 1;
    });
    return domains;
  }
);

// Solution: Search selector factory
export const selectUsersBySearchTerm = (searchTerm: string) => createSelector(
  selectAllUsers,
  (users) => {
    if (!searchTerm.trim()) {
      return users;
    }

    const term = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }
);

// Solution: Sorting selector factory
export const selectUsersSorted = (sortBy: 'name' | 'email' | 'createdAt', direction: 'asc' | 'desc' = 'asc') =>
  createSelector(
    selectAllUsers,
    (users) => {
      const sorted = [...users].sort((a, b) => {
        let aValue: any = a[sortBy];
        let bValue: any = b[sortBy];

        if (sortBy === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else {
          aValue = aValue.toString().toLowerCase();
          bValue = bValue.toString().toLowerCase();
        }

        if (direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      return sorted;
    }
  );

// Solution: Loading state helpers
export const selectIsLoadingUsers = createSelector(
  selectUsersLoading,
  (loading) => loading
);

export const selectHasUsersError = createSelector(
  selectUsersError,
  (error) => !!error
);

export const selectIsUsersEmpty = createSelector(
  selectAllUsers,
  selectUsersLoading,
  (users, loading) => users.length === 0 && !loading
);`,
      'user.component.ts': `import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as UserActions from './user.actions';
import * as UserSelectors from './user.selectors';
import { User, CreateUserRequest } from './user.actions';

@Component({
  selector: 'app-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="user-container">
      <h2>User Management</h2>

      <!-- Solution: Proper loading and error handling -->
      <div class="status-bar">
        <div *ngIf="loading$ | async" class="loading">
          <span class="spinner"></span> Loading users...
        </div>

        <div *ngIf="error$ | async as error" class="error">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
          <button (click)="clearError()" class="clear-error">×</button>
        </div>

        <div *ngIf="isEmpty$ | async" class="empty-state">
          <span class="empty-icon">👥</span>
          <p>No users found. Add your first user below!</p>
        </div>
      </div>

      <!-- Solution: Search and filter controls -->
      <div class="controls">
        <div class="search-section">
          <input
            type="text"
            placeholder="Search users..."
            [formControl]="searchControl"
            class="search-input"
          >
          <select [formControl]="sortControl" class="sort-select">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
            <option value="email-desc">Email (Z-A)</option>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
          </select>
        </div>

        <div class="filter-section">
          <label>
            <input
              type="checkbox"
              [formControl]="showActiveOnlyControl"
            > Show active only
          </label>
        </div>

        <div class="stats">
          Total: {{ usersCount$ | async }} |
          Active: {{ activeUsersCount$ | async }}
        </div>
      </div>

      <!-- Solution: User list with proper trackBy -->
      <div class="user-list" *ngIf="!(isEmpty$ | async)">
        <div
          *ngFor="let user of displayedUsers$ | async; trackBy: trackByUserId"
          class="user-item"
          [class.selected]="(selectedUserId$ | async) === user.id"
          (click)="selectUser(user.id)"
        >
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-email">{{ user.email }}</div>
            <div class="user-meta">
              <span class="status" [class.active]="user.active">
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
              <span class="created-date">
                Created: {{ user.createdAt | date:'short' }}
              </span>
            </div>
          </div>

          <div class="user-actions">
            <button
              (click)="editUser(user); $event.stopPropagation()"
              class="btn btn-edit"
              [disabled]="loading$ | async"
            >
              Edit
            </button>
            <button
              (click)="confirmDeleteUser(user); $event.stopPropagation()"
              class="btn btn-delete"
              [disabled]="loading$ | async"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Solution: Add user form with validation -->
      <div class="add-user-section">
        <h3>Add New User</h3>
        <form [formGroup]="addUserForm" (ngSubmit)="addUser()" class="add-user-form">
          <div class="form-group">
            <label for="name">Name *</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="form-control"
              [class.error]="addUserForm.get('name')?.invalid && addUserForm.get('name')?.touched"
            >
            <div
              *ngIf="addUserForm.get('name')?.invalid && addUserForm.get('name')?.touched"
              class="error-message"
            >
              <span *ngIf="addUserForm.get('name')?.errors?.['required']">Name is required</span>
              <span *ngIf="addUserForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</span>
              <span *ngIf="addUserForm.get('name')?.errors?.['maxlength']">Name must be less than 50 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-control"
              [class.error]="addUserForm.get('email')?.invalid && addUserForm.get('email')?.touched"
            >
            <div
              *ngIf="addUserForm.get('email')?.invalid && addUserForm.get('email')?.touched"
              class="error-message"
            >
              <span *ngIf="addUserForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="addUserForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="addUserForm.invalid || (loading$ | async)"
          >
            <span *ngIf="loading$ | async" class="spinner"></span>
            Add User
          </button>
        </form>
      </div>

      <!-- Solution: Selected user details -->
      <div *ngIf="selectedUser$ | async as selectedUser" class="selected-user">
        <h3>Selected User Details</h3>
        <div class="user-details">
          <p><strong>ID:</strong> {{ selectedUser.id }}</p>
          <p><strong>Name:</strong> {{ selectedUser.name }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Status:</strong> {{ selectedUser.active ? 'Active' : 'Inactive' }}</p>
          <p><strong>Created:</strong> {{ selectedUser.createdAt | date:'full' }}</p>
          <p><strong>Updated:</strong> {{ selectedUser.updatedAt | date:'full' }}</p>
        </div>
        <button (click)="clearSelection()" class="btn btn-secondary">Clear Selection</button>
      </div>
    </div>
  \`,
  styles: [\`
    .user-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .status-bar {
      margin-bottom: 20px;
      min-height: 40px;
    }

    .loading, .error, .empty-state {
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .loading {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .error {
      background-color: #ffebee;
      color: #c62828;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .empty-state {
      background-color: #f5f5f5;
      color: #666;
      text-align: center;
    }

    .controls {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .search-section {
      display: flex;
      gap: 10px;
    }

    .search-input, .sort-select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .user-list {
      border: 1px solid #ddd;
      border-radius: 4px;
      max-height: 400px;
      overflow-y: auto;
    }

    .user-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .user-item:hover {
      background-color: #f5f5f5;
    }

    .user-item.selected {
      background-color: #e3f2fd;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-weight: bold;
      margin-bottom: 4px;
    }

    .user-email {
      color: #666;
      margin-bottom: 4px;
    }

    .user-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #888;
    }

    .status.active {
      color: #4caf50;
    }

    .user-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn-edit {
      background-color: #2196f3;
      color: white;
    }

    .btn-delete {
      background-color: #f44336;
      color: white;
    }

    .btn-primary {
      background-color: #4caf50;
      color: white;
    }

    .btn-secondary {
      background-color: #757575;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .add-user-section {
      margin-top: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .add-user-form {
      display: flex;
      gap: 15px;
      align-items: end;
    }

    .form-group {
      flex: 1;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .form-control.error {
      border-color: #f44336;
    }

    .error-message {
      color: #f44336;
      font-size: 12px;
      margin-top: 4px;
    }

    .selected-user {
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
    }

    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #333;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .clear-error {
      background: none;
      border: none;
      color: #c62828;
      cursor: pointer;
      font-size: 16px;
      padding: 0;
      margin-left: auto;
    }
  \`]
})
export class UserComponent implements OnInit, OnDestroy {
  // Solution: Properly typed observables
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedUser$: Observable<User | null>;
  selectedUserId$: Observable<string | null>;
  usersCount$: Observable<number>;
  activeUsersCount$: Observable<number>;
  isEmpty$: Observable<boolean>;
  displayedUsers$: Observable<User[]>;

  // Solution: Form controls for search and filtering
  searchControl = this.fb.control('');
  sortControl = this.fb.control('name-asc');
  showActiveOnlyControl = this.fb.control(false);

  // Solution: Reactive form with validation
  addUserForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.initializeSelectors();
    this.initializeForm();
    this.setupDisplayedUsers();
  }

  ngOnInit() {
    // Solution: Check if data needs to be loaded
    this.store.select(UserSelectors.selectLastUpdated)
      .pipe(takeUntil(this.destroy$))
      .subscribe(lastUpdated => {
        if (!lastUpdated) {
          this.store.dispatch(UserActions.loadUsers());
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSelectors() {
    this.users$ = this.store.select(UserSelectors.selectAllUsers);
    this.loading$ = this.store.select(UserSelectors.selectUsersLoading);
    this.error$ = this.store.select(UserSelectors.selectUsersError);
    this.selectedUser$ = this.store.select(UserSelectors.selectSelectedUser);
    this.selectedUserId$ = this.store.select(UserSelectors.selectSelectedUserId);
    this.usersCount$ = this.store.select(UserSelectors.selectUsersCount);
    this.activeUsersCount$ = this.store.select(UserSelectors.selectActiveUsersCount);
    this.isEmpty$ = this.store.select(UserSelectors.selectIsUsersEmpty);
  }

  private initializeForm() {
    this.addUserForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  private setupDisplayedUsers() {
    // Solution: Combine search, sort, and filter
    this.displayedUsers$ = combineLatest([
      this.users$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.sortControl.valueChanges.pipe(startWith('name-asc')),
      this.showActiveOnlyControl.valueChanges.pipe(startWith(false))
    ]).pipe(
      map(([users, searchTerm, sortValue, showActiveOnly]) => {
        let filtered = users;

        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
          );
        }

        // Filter by active status
        if (showActiveOnly) {
          filtered = filtered.filter(user => user.active);
        }

        // Sort
        const [sortBy, direction] = sortValue.split('-') as [keyof User, 'asc' | 'desc'];
        filtered = [...filtered].sort((a, b) => {
          let aValue: any = a[sortBy];
          let bValue: any = b[sortBy];

          if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          } else {
            aValue = aValue.toString().toLowerCase();
            bValue = bValue.toString().toLowerCase();
          }

          const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          return direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      })
    );
  }

  // Solution: TrackBy function for performance
  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  selectUser(userId: string) {
    this.store.dispatch(UserActions.selectUser({ userId }));
  }

  clearSelection() {
    this.store.dispatch(UserActions.clearSelectedUser());
  }

  editUser(user: User) {
    // Solution: Proper update with validation
    const name = prompt('Enter new name:', user.name);
    if (name && name.trim() && name !== user.name) {
      this.store.dispatch(UserActions.updateUser({
        update: {
          id: user.id,
          changes: {
            name: name.trim(),
            updatedAt: new Date()
          }
        }
      }));
    }
  }

  confirmDeleteUser(user: User) {
    // Solution: Confirmation dialog
    if (confirm(\`Are you sure you want to delete user "\${user.name}"?\`)) {
      this.store.dispatch(UserActions.deleteUser({ id: user.id }));
    }
  }

  addUser() {
    if (this.addUserForm.valid) {
      const formValue = this.addUserForm.value;
      const user: CreateUserRequest = {
        name: formValue.name.trim(),
        email: formValue.email.trim().toLowerCase()
      };

      this.store.dispatch(UserActions.createUser({ user }));

      // Solution: Reset form only after successful creation
      this.store.select(UserSelectors.selectUsersError)
        .pipe(takeUntil(this.destroy$))
        .subscribe(error => {
          if (!error) {
            this.addUserForm.reset();
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.addUserForm.controls).forEach(key => {
        this.addUserForm.get(key)?.markAsTouched();
      });
    }
  }

  clearError() {
    this.store.dispatch(UserActions.clearError());
  }

  refreshUsers() {
    this.store.dispatch(UserActions.loadUsers());
  }
}`
    },
    testCases: [
      'Actions should follow consistent naming conventions',
      'Reducers should maintain immutable state updates',
      'Effects should handle errors and use appropriate operators',
      'Selectors should be properly memoized and typed'
    ],
    debuggingSteps: [
      'Check Redux DevTools for action flow',
      'Verify state mutations are immutable',
      'Test effect error handling and retry logic',
      'Validate selector performance and memoization'
    ],
    commonMistakes: [
      'Mutating state directly in reducers',
      'Using wrong RxJS operators in effects',
      'Missing error handling and loading states',
      'Inefficient selectors without memoization'
    ],
    productionImpact: 'State inconsistency, memory leaks, poor performance, broken UI updates',
    preventionTips: [
      'Always use immutable state updates',
      'Choose appropriate RxJS operators for effects',
      'Implement comprehensive error handling',
      'Use entity adapters for normalized state'
    ]
  },

  // ===== ADVANCED ROUTING ISSUES (5 challenges) =====

  {
    id: 'angular-route-resolver-issues',
    title: 'Route Resolver Data Loading Issues',
    description: 'Route resolvers not loading data properly and blocking navigation',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['Angular', 'Routing', 'Resolver', 'Data Loading'],
    rootCause: 'Improper resolver implementation and error handling',
    category: 'Routing',
    files: {
      'user-resolver.service.ts': `import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class UserResolver implements Resolve<any> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const userId = route.paramMap.get('id');

    // BUG: Not handling errors properly!
    return this.userService.getUser(userId);

    // BUG: Not handling null/undefined userId!
    // BUG: No loading states or fallbacks!
  }
}`,
      'user.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<any> {
    // BUG: API might fail but resolver doesn't handle it!
    return this.http.get(\`/api/users/\${id}\`);
  }
}`
    },
    hints: [
      'Add proper error handling in resolvers',
      'Handle null/undefined route parameters',
      'Provide fallback data when API fails',
      'Consider loading states and user feedback'
    ],
    solution: {
      'user-resolver.service.ts': `import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class UserResolver implements Resolve<any> {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const userId = route.paramMap.get('id');

    // Solution: Handle missing userId
    if (!userId) {
      this.router.navigate(['/users']);
      return EMPTY;
    }

    // Solution: Proper error handling with fallback
    return this.userService.getUser(userId).pipe(
      map(user => user || { id: userId, name: 'Unknown User', error: true }),
      catchError(error => {
        console.error('Failed to load user:', error);
        // Provide fallback data instead of blocking navigation
        return of({
          id: userId,
          name: 'User Not Found',
          error: true,
          message: 'Failed to load user data'
        });
      })
    );
  }
}`
    },
    testCases: [
      'Resolver should handle missing user IDs gracefully',
      'API failures should not block navigation',
      'Fallback data should be provided when user not found',
      'Error states should be properly communicated'
    ],
    debuggingSteps: [
      'Check resolver implementation and error handling',
      'Test with invalid user IDs and API failures',
      'Verify navigation behavior with resolver errors',
      'Monitor network requests and error responses'
    ],
    commonMistakes: [
      'Not handling resolver errors properly',
      'Blocking navigation when data fails to load',
      'Not validating route parameters',
      'Missing fallback data for error states'
    ],
    productionImpact: 'Navigation blocking, poor user experience, application crashes on data loading failures',
    preventionTips: [
      'Always handle resolver errors with fallbacks',
      'Validate route parameters before using them',
      'Provide meaningful error states and messages',
      'Consider loading indicators for slow resolvers'
    ]
  },

  {
    id: 'angular-route-preloading-strategy',
    title: 'Route Preloading Strategy Issues',
    description: 'Custom preloading strategies not working and affecting performance',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 160,
    tags: ['Angular', 'Routing', 'Preloading', 'Performance'],
    rootCause: 'Incorrect preloading strategy implementation and configuration',
    category: 'Routing',
    files: {
      'custom-preloading.strategy.ts': `import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    // BUG: Not checking if route should be preloaded!
    return fn();

    // BUG: No conditions for when to preload!
    // BUG: Might preload everything, causing performance issues!
  }
}`,
      'app-routing.module.ts': `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading.strategy';

const routes: Routes = [
  {
    path: 'feature-a',
    loadChildren: () => import('./feature-a/feature-a.module').then(m => m.FeatureAModule),
    // BUG: No preload configuration!
  },
  {
    path: 'feature-b',
    loadChildren: () => import('./feature-b/feature-b.module').then(m => m.FeatureBModule),
    data: { preload: true }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // BUG: Strategy not properly configured!
    preloadingStrategy: CustomPreloadingStrategy
  })],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy]
})
export class AppRoutingModule {}`
    },
    hints: [
      'Check route data for preloading configuration',
      'Implement conditions for selective preloading',
      'Consider network conditions and user preferences',
      'Add proper error handling for preloading failures'
    ],
    solution: {
      'custom-preloading.strategy.ts': `import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    // Solution: Check if route should be preloaded
    if (route.data && route.data['preload']) {
      // Check network conditions
      if (this.shouldPreload()) {
        console.log('Preloading route:', route.path);
        return fn();
      }
    }

    // Don't preload by default
    return of(null);
  }

  private shouldPreload(): boolean {
    // Check network connection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      // Don't preload on slow connections
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return false;
      }
    }

    // Check if user prefers reduced data usage
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.saveData) {
        return false;
      }
    }

    return true;
  }
}`,
      'app-routing.module.ts': `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading.strategy';

const routes: Routes = [
  {
    path: 'feature-a',
    loadChildren: () => import('./feature-a/feature-a.module').then(m => m.FeatureAModule),
    data: { preload: false } // Don't preload this heavy module
  },
  {
    path: 'feature-b',
    loadChildren: () => import('./feature-b/feature-b.module').then(m => m.FeatureBModule),
    data: { preload: true } // Preload this commonly used module
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { preload: false } // Don't preload admin module for regular users
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadingStrategy,
    enableTracing: false // Set to true for debugging
  })],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy]
})
export class AppRoutingModule {}`
    },
    testCases: [
      'Only routes with preload: true should be preloaded',
      'Preloading should respect network conditions',
      'Strategy should handle preloading failures gracefully',
      'Performance should improve for preloaded routes'
    ],
    debuggingSteps: [
      'Enable router tracing to see preloading behavior',
      'Monitor network tab for preloaded modules',
      'Test on different network conditions',
      'Verify route data configuration'
    ],
    commonMistakes: [
      'Preloading all routes regardless of conditions',
      'Not considering network conditions and data usage',
      'Missing route data configuration',
      'Not handling preloading failures'
    ],
    productionImpact: 'Poor performance on slow networks, excessive data usage, battery drain',
    preventionTips: [
      'Implement selective preloading based on route data',
      'Consider network conditions and user preferences',
      'Monitor preloading performance and adjust strategy',
      'Provide fallbacks for preloading failures'
    ]
  },

  // ===== ADVANCED FORMS ISSUES (5 challenges) =====

  {
    id: 'angular-dynamic-forms-validation',
    title: 'Dynamic Forms Validation Issues',
    description: 'Complex dynamic forms with conditional validation not working properly',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '30 min',
    xpReward: 180,
    tags: ['Angular', 'Forms', 'Dynamic', 'Validation'],
    rootCause: 'Improper dynamic form control management and validation setup',
    category: 'Forms',
    files: {
      'dynamic-form.component.ts': `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  template: \`
    <form [formGroup]="dynamicForm" (ngSubmit)="onSubmit()">
      <div formArrayName="fields">
        <div *ngFor="let field of fieldsArray.controls; let i = index" [formGroupName]="i">
          <label>{{getFieldConfig(i).label}}</label>
          <input [type]="getFieldConfig(i).type" formControlName="value">
          <div *ngIf="field.get('value')?.errors?.['required']">Required</div>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  \`
})
export class DynamicFormComponent implements OnInit {
  dynamicForm: FormGroup;
  fieldConfigs = [
    { label: 'Name', type: 'text', required: true },
    { label: 'Email', type: 'email', required: true },
    { label: 'Phone', type: 'tel', required: false }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.dynamicForm = this.fb.group({
      fields: this.fb.array([])
    });

    // BUG: Not properly setting up dynamic validators!
    this.fieldConfigs.forEach(config => {
      const fieldGroup = this.fb.group({
        value: [''] // Missing validators!
      });
      this.fieldsArray.push(fieldGroup);
    });
  }

  get fieldsArray() {
    return this.dynamicForm.get('fields') as FormArray;
  }

  getFieldConfig(index: number) {
    return this.fieldConfigs[index];
  }

  onSubmit() {
    // BUG: Not validating properly!
    console.log(this.dynamicForm.value);
  }
}`
    },
    hints: [
      'Add validators dynamically based on field configuration',
      'Implement proper form validation before submission',
      'Handle conditional validation based on field types',
      'Provide proper error messages for each field type'
    ],
    solution: {
      'dynamic-form.component.ts': `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  template: \`
    <form [formGroup]="dynamicForm" (ngSubmit)="onSubmit()">
      <div formArrayName="fields">
        <div *ngFor="let field of fieldsArray.controls; let i = index" [formGroupName]="i">
          <label>{{getFieldConfig(i).label}}</label>
          <input
            [type]="getFieldConfig(i).type"
            formControlName="value"
            [class.error]="field.get('value')?.invalid && field.get('value')?.touched">

          <!-- Solution: Proper error handling for each field type -->
          <div *ngIf="field.get('value')?.errors && field.get('value')?.touched" class="error-messages">
            <div *ngIf="field.get('value')?.errors?.['required']">
              {{getFieldConfig(i).label}} is required
            </div>
            <div *ngIf="field.get('value')?.errors?.['email']">
              Please enter a valid email address
            </div>
            <div *ngIf="field.get('value')?.errors?.['pattern']">
              Please enter a valid {{getFieldConfig(i).type}}
            </div>
          </div>
        </div>
      </div>
      <button type="submit" [disabled]="dynamicForm.invalid">Submit</button>
    </form>
  \`
})
export class DynamicFormComponent implements OnInit {
  dynamicForm: FormGroup;
  fieldConfigs = [
    { label: 'Name', type: 'text', required: true },
    { label: 'Email', type: 'email', required: true },
    { label: 'Phone', type: 'tel', required: false, pattern: '^[+]?[0-9\\s\\-\\(\\)]+$' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.dynamicForm = this.fb.group({
      fields: this.fb.array([])
    });

    // Solution: Properly set up dynamic validators
    this.fieldConfigs.forEach(config => {
      const validators = this.getValidatorsForField(config);
      const fieldGroup = this.fb.group({
        value: ['', validators]
      });
      this.fieldsArray.push(fieldGroup);
    });
  }

  private getValidatorsForField(config: any): any[] {
    const validators = [];

    if (config.required) {
      validators.push(Validators.required);
    }

    if (config.type === 'email') {
      validators.push(Validators.email);
    }

    if (config.pattern) {
      validators.push(Validators.pattern(config.pattern));
    }

    return validators;
  }

  get fieldsArray() {
    return this.dynamicForm.get('fields') as FormArray;
  }

  getFieldConfig(index: number) {
    return this.fieldConfigs[index];
  }

  onSubmit() {
    // Solution: Proper validation before submission
    if (this.dynamicForm.valid) {
      const formData = this.dynamicForm.value;
      console.log('Form submitted:', formData);
      // Process form data
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.dynamicForm);
      console.log('Form is invalid');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}`
    },
    testCases: [
      'Required fields should show validation errors when empty',
      'Email field should validate email format',
      'Phone field should validate phone number pattern',
      'Form submission should be disabled when invalid'
    ],
    debuggingSteps: [
      'Check dynamic validator setup for each field type',
      'Verify form validation state before submission',
      'Test conditional validation based on field configuration',
      'Monitor form control states and error messages'
    ],
    commonMistakes: [
      'Not setting up validators dynamically',
      'Missing proper error handling for different field types',
      'Not validating form before submission',
      'Improper form control state management'
    ],
    productionImpact: 'Invalid data submission, poor user experience, data integrity issues',
    preventionTips: [
      'Set up validators dynamically based on field configuration',
      'Implement comprehensive error handling for all field types',
      'Always validate forms before submission',
      'Provide clear validation feedback to users'
    ]
  },

  {
    id: 'angular-form-array-performance',
    title: 'FormArray Performance Issues',
    description: 'Large FormArrays causing performance problems and memory leaks',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 170,
    tags: ['Angular', 'Forms', 'Performance', 'FormArray'],
    rootCause: 'Inefficient FormArray management and lack of change detection optimization',
    category: 'Forms',
    files: {
      'large-form-array.component.ts': `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-large-form-array',
  template: \`
    <form [formGroup]="form">
      <div formArrayName="items">
        <div *ngFor="let item of itemsArray.controls; let i = index" [formGroupName]="i">
          <input formControlName="name" placeholder="Item name">
          <input formControlName="quantity" type="number" placeholder="Quantity">
          <button type="button" (click)="removeItem(i)">Remove</button>
        </div>
      </div>
      <button type="button" (click)="addItem()">Add Item</button>
    </form>
  \`
})
export class LargeFormArrayComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      items: this.fb.array([])
    });

    // BUG: Adding too many items without optimization!
    for (let i = 0; i < 1000; i++) {
      this.addItem();
    }
  }

  get itemsArray() {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    // BUG: Creating new FormGroup every time without reuse!
    const itemGroup = this.fb.group({
      name: [''],
      quantity: [0]
    });
    this.itemsArray.push(itemGroup);
  }

  removeItem(index: number) {
    // BUG: Not properly cleaning up removed controls!
    this.itemsArray.removeAt(index);
  }
}`
    },
    hints: [
      'Implement virtual scrolling for large lists',
      'Use trackBy functions to optimize rendering',
      'Consider pagination or lazy loading',
      'Optimize change detection with OnPush strategy'
    ],
    solution: {
      'large-form-array.component.ts': `import { Component, OnInit, ChangeDetectionStrategy, TrackByFunction } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-large-form-array',
  changeDetection: ChangeDetectionStrategy.OnPush, // Solution: Optimize change detection
  template: \`
    <form [formGroup]="form">
      <div class="controls">
        <button type="button" (click)="addItem()">Add Item</button>
        <span>Total items: {{itemsArray.length}}</span>
      </div>

      <!-- Solution: Virtual scrolling for large lists -->
      <cdk-virtual-scroll-viewport itemSize="60" class="viewport">
        <div formArrayName="items">
          <div
            *cdkVirtualFor="let item of itemsArray.controls; let i = index; trackBy: trackByIndex"
            [formGroupName]="i"
            class="item-row">
            <input formControlName="name" placeholder="Item name">
            <input formControlName="quantity" type="number" placeholder="Quantity">
            <button type="button" (click)="removeItem(i)">Remove</button>
          </div>
        </div>
      </cdk-virtual-scroll-viewport>
    </form>
  \`,
  styles: [\`
    .viewport {
      height: 400px;
      width: 100%;
    }
    .item-row {
      height: 60px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .controls {
      padding: 10px;
      border-bottom: 2px solid #ddd;
    }
  \`]
})
export class LargeFormArrayComponent implements OnInit {
  form: FormGroup;
  private itemPool: FormGroup[] = []; // Solution: Reuse FormGroups

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      items: this.fb.array([])
    });

    // Solution: Add items in batches to avoid blocking UI
    this.addItemsBatch(100);
  }

  get itemsArray() {
    return this.form.get('items') as FormArray;
  }

  // Solution: TrackBy function for better performance
  trackByIndex: TrackByFunction<any> = (index: number) => index;

  addItem() {
    // Solution: Reuse FormGroups from pool
    let itemGroup = this.itemPool.pop();
    if (!itemGroup) {
      itemGroup = this.fb.group({
        name: [''],
        quantity: [0]
      });
    } else {
      // Reset values when reusing
      itemGroup.reset();
    }
    this.itemsArray.push(itemGroup);
  }

  removeItem(index: number) {
    // Solution: Return FormGroup to pool for reuse
    const removedControl = this.itemsArray.at(index) as FormGroup;
    this.itemsArray.removeAt(index);

    // Add to pool for reuse (limit pool size)
    if (this.itemPool.length < 50) {
      this.itemPool.push(removedControl);
    }
  }

  private addItemsBatch(count: number, batchSize: number = 10) {
    // Solution: Add items in small batches to avoid blocking UI
    let added = 0;
    const addBatch = () => {
      const batchEnd = Math.min(added + batchSize, count);
      for (let i = added; i < batchEnd; i++) {
        this.addItem();
      }
      added = batchEnd;

      if (added < count) {
        // Use setTimeout to yield control back to the browser
        setTimeout(addBatch, 0);
      }
    };
    addBatch();
  }

  // Solution: Bulk operations for better performance
  addMultipleItems(count: number) {
    const newItems = [];
    for (let i = 0; i < count; i++) {
      newItems.push(this.fb.group({
        name: [''],
        quantity: [0]
      }));
    }

    // Add all at once to minimize change detection cycles
    newItems.forEach(item => this.itemsArray.push(item));
  }

  clearAll() {
    // Solution: Efficient clearing with pool management
    while (this.itemsArray.length > 0) {
      const control = this.itemsArray.at(0) as FormGroup;
      this.itemsArray.removeAt(0);
      if (this.itemPool.length < 100) {
        this.itemPool.push(control);
      }
    }
  }
}`
    },
    testCases: [
      'Large FormArrays should render without performance issues',
      'Adding/removing items should be smooth and responsive',
      'Memory usage should remain stable with many operations',
      'Virtual scrolling should handle thousands of items'
    ],
    debuggingSteps: [
      'Monitor performance with Angular DevTools',
      'Check memory usage during add/remove operations',
      'Verify virtual scrolling is working properly',
      'Test with different array sizes and operations'
    ],
    commonMistakes: [
      'Not using virtual scrolling for large lists',
      'Creating new FormGroups unnecessarily',
      'Missing trackBy functions for ngFor',
      'Not optimizing change detection strategy'
    ],
    productionImpact: 'Poor performance, memory leaks, unresponsive UI with large datasets',
    preventionTips: [
      'Use virtual scrolling for large FormArrays',
      'Implement object pooling for FormGroups',
      'Use OnPush change detection strategy',
      'Add items in batches to avoid blocking UI'
    ]
  }
];

// Export total count for verification
export const angularDebugChallengesCount = angularDebugChallenges.length;
