window.projectsData = [
  {
    "id": 10,
    "title": "MNIST Digit Classification System",
    "tagline": "End-to-end handwritten digit recognition with a CNN model and microservices architecture",
    "category": "Systems Engineering",
    "techStack": [
      "Python",
      "FastAPI",
      "TensorFlow",
      "Keras",
      "Java",
      "Spring Boot",
      "WebClient",
      "React",
      "HTML5 Canvas",
      "Maven",
      "Docker",
      "Docker Compose",
      "NumPy",
      "Pydantic"
    ],
    "image": "project_images/dps01.png",
    "images": [
      "project_images/dps01.png",
      "project_images/dps02.png",
      "project_images/dps03.png",
      "project_images/dps04.png"
    ],
    "github": "https://github.com/khushnood956/ML-Digit_Predictor",
    "live": "#",
    "featured": true,
    "description": "A full-stack AI application where users draw digits on a browser canvas and get real-time predictions through a Spring Boot gateway connected to a FastAPI inference service hosting a trained CNN model.",
    "problem": "Manual digit recognition is error-prone and not scalable for educational demos and automation workflows. This project solves that by delivering a production-style ML inference pipeline that transforms user-drawn input into accurate digit predictions with confidence scores.",
    "architecture": "4-layer architecture: Frontend canvas UI (React/HTML/JS) -> Spring Boot API Gateway (validation, orchestration, error handling) -> FastAPI inference service (model serving) -> TensorFlow/Keras CNN model trained on MNIST. Services communicate over REST with health checks and structured DTOs.",
    "challenges": "Converting freehand canvas strokes into a normalized 28x28 pixel array, ensuring strict input validation across services, handling inter-service failures gracefully, keeping latency low for real-time UX, and maintaining consistency between Java and Python request-response contracts.",
    "learnings": "Practical microservice orchestration between Java and Python, production-style API validation and exception handling, model-serving lifecycle management in FastAPI, robust service health monitoring, and end-to-end deployment using Docker Compose.",
    "futureImprovements": "Add authentication and rate limiting, introduce model versioning and A/B testing, support multiple datasets and custom model uploads, persist prediction analytics in a database, add CI/CD with automated integration tests, and deploy to cloud with container orchestration."
  },
  {
    "id": 11,
    "title": "Multithreaded C++ File Search Engine",
    "tagline": "A high-performance concurrent file search engine utilizing POSIX threads and mutex   synchronization in C++17.",
    "category": "Systems Engineering",
    "techStack": [
      "C++",
      "POSIX Threads (pthread)",
      "C++17",
      "Mutex Lock",
      "Thread Synchronization",
      "Linux/Ubuntu"
    ],
    "image": "project_images/mts01.jpg",
    "images": [
      "project_images/mts01.jpg",
      "project_images/mts02.png",
      "project_images/mts03.png",
      "project_images/mts04.jpg"
    ],
    "github": "https://github.com/khushnood956/-Multithreaded-C-File-Search-Engine",
    "live": "#",
    "featured": true,
    "description": "A concurrent directory scanning and pattern matching engine built in C++17. Designed to optimize disk read throughput and search speeds by distributing traversal work across multiple worker threads (POSIX pthreads), using a thread-safe mutex-protected queue to aggregate matched patterns in real time.",
    "problem": "Traditional single-threaded file search tools scale poorly when traversing deeply nested directories and scanning large text files. By leveraging multi-core architectures, this engine divides directories and subdirectories among multiple threads, enabling parallel file reads and string pattern matching, which substantially reduces overall search latency.",
    "architecture": "The engine utilizes a Parent-Worker multithreading model. The Main Thread acts as the coordinator: it validates directories, initializes the shared mutex, and spawns one worker thread per top-level entry in the target directory. Each Worker Thread recursively traverses its assigned path, scans files line-by-line, and executes string pattern matching. Discovered matches are pushed to a central shared ResultQueue protected by a POSIX mutex lock to prevent race conditions. The Main Thread joins all workers and prints ranked, aggregated results sorted by match frequency.",
    "challenges": "1. Race Conditions in Shared Queue: Ensuring multiple threads can concurrently write matched results without causing data corruption. Solved by implementing a mutex-locked critical section inside the queue's push function.\n2. Dynamic Work Distribution: Spawning an efficient number of threads without causing thread-creation overhead or CPU thrashing. Spawning was mapped to the root directory's top-level items to distribute traversal loads naturally.\n3. Memory Management in C++: Avoiding memory leaks from thread arguments passed to pthread_create. Handled by dynamically allocating a ThreadArgs structure for each thread and ensuring each thread safely deallocates its arguments upon entry.",
    "learnings": "1. Deep understanding of POSIX thread creation, joining, and thread lifecycles.\n  2. Hands-on experience with thread synchronization mechanisms (pthread_mutex_t, lock/unlock operations) to protect critical sections.\n  3. Efficient filesystem traversal in C++ using the standard std::filesystem library, including handling permission issues during recursive iteration",
    "futureImprovements": "1. Thread Pool Pattern: Implement a thread pool with a task queue to limit the maximum number of concurrent threads, optimizing CPU core utilization and avoiding thread overhead on extremely large directories.\n2. Advanced Pattern Matching: Integrate faster string-matching algorithms like Boyer-Moore or\nKnuth-Morris-Pratt (KMP) for scanning larger files.\n3. Regex Support: Allow users to search using regular expressions instead of plain string matching."
  },
  {
    "id": 9,
    "title": "WHATSAPP SPAM DETECTOR",
    "tagline": "Detect spam and phishing messages in WhatsApp chats with machine learning",
    "category": "Systems Engineering",
    "techStack": [
      "Python",
      "Streamlit",
      "scikit-learn",
      "pandas",
      "numpy",
      "matplotlib",
      "seaborn",
      "NLTK",
      "Joblib"
    ],
    "image": "project_images/wsd01.png",
    "images": [
      "project_images/wsd01.png",
      "project_images/wsd02.png"
    ],
    "github": "https://github.com/khushnood956/WHATSAPP-SPAM-DETECTOR",
    "live": "#",
    "featured": true,
    "description": "A Streamlit web app that classifies WhatsApp messages as spam or ham using machine learning models and text preprocessing. It includes a chat-style interface, model selection, prediction confidence, and a visual performance dashboard.",
    "problem": "Helps users identify suspicious or spam-like messages in chat exports before interacting with them",
    "architecture": "Streamlit frontend for input and display, preprocessing layer for text cleaning, TF-IDF vectorization, and trained classification models loaded through Joblib",
    "challenges": "Consistent preprocessing between training and prediction, loading model artifacts safely, handling missing model files, and presenting prediction results in a simple chat-style interface",
    "learnings": "Text normalization, feature extraction with TF-IDF, model inference with scikit-learn, and building an interactive ML web app with Streamlit",
    "futureImprovements": "Add upload support for WhatsApp chat exports, retrain models on larger datasets, show explainability for predictions, and store prediction history persistently"
  },
  {
    "id": 5,
    "title": "Database Schema Design",
    "tagline": "Normalized e-commerce schema architecture engineered using Oracle SQL Developer.",
    "description": "A relational database schema designed from requirements to 3NF. It contains multi-table entities with complex relational joins, foreign keys, cascade constraints, and custom indexing to support order pipelines, user reviews, and payment processing.",
    "category": "Databases",
    "techStack": [
      "SQL",
      "Oracle Database",
      "Relational Modeling",
      "ER Diagrams"
    ],
    "image": "project_images/sql01.jpg",
    "images": [
      "project_images/sql01.jpg",
      "project_images/SQL02.jpg",
      "project_images/SQL03.jpg"
    ],
    "github": "https://github.com/khushnood956/Database-Schema-Design",
    "live": "#",
    "featured": true,
    "problem": "Badly structured database schemas cause data redundancies, deletion anomalies, and performance bottlenecks as join datasets grow.",
    "architecture": "A normalized relational model designed up to Third Normal Form (3NF). Built using Oracle SQL Developer. Establishes primary/foreign keys, unique constraints, and check bounds across entities like Users, Orders, Products, Payments, and CartItems.",
    "challenges": "Balancing schema normalization rules (which decrease redundancy) with join query speeds under load, demanding careful indexing strategies.",
    "learnings": "Developed skills in Entity-Relationship (ER) modeling, normal forms (1NF, 2NF, 3NF), writing efficient SQL queries using nested subqueries, aggregations, and inner/outer joins.",
    "futureImprovements": "Write stored procedures and database triggers in PL/SQL to automate order status updates and stock level updates on new order logs."
  },
  {
    "id": 4,
    "title": "In-Memory DBMS",
    "tagline": "Custom file-handling database system in Java showcasing SQL parsing and table storage.",
    "description": "A database engine simulation developed in Java. It parses SQL-like CLI inputs, compiles schema metadata, and maintains structured data files in a custom binary or text layout to support record inserts, updates, and indexing.",
    "category": "Systems Engineering",
    "techStack": [
      "Java",
      "File IO",
      "Parsing Algorithms",
      "Database Theory"
    ],
    "image": "project_images/db01.png",
    "images": [
      "project_images/db01.png",
      "project_images/db02.png"
    ],
    "github": "https://github.com/khushnood956/In-Memory-DBMS",
    "live": "#",
    "featured": false,
    "problem": "Understanding how databases execute queries and guarantee durability without looking under the hood of production databases can be difficult for backend developers.",
    "architecture": "Consists of a Query Parser engine, a Catalog Manager for table definitions, and a Storage Engine writing rows to files. Table files store field values delimited by custom markers, and indices are held in memory for quick retrieval.",
    "challenges": "Designing an efficient text parser that handles complex conditions (such as WHERE clauses with operators) and serializing record structures without corruption.",
    "learnings": "Understood the details of database storage layouts, metadata management, file parsing bottlenecks, and how database transactions write changes to disk.",
    "futureImprovements": "Implement B-Tree indices to support search speeds of O(log N) for larger files, and add support for transaction rollback logs."
  },
  {
    "id": 3,
    "title": "Money Manager App",
    "tagline": "Mobile expense tracker designed in Kotlin for intuitive personal finance management.",
    "description": "An Android application created using Kotlin to log income, track daily spending, and manage debts. It features a clean material UI designed for mobile responsiveness and lightweight local storage operations.",
    "category": "Mobile Dev",
    "techStack": [
      "Kotlin",
      "Android SDK",
      "SQLite",
      "Material Design"
    ],
    "image": "project_images/kt001.png",
    "images": [
      "project_images/kt001.png",
      "project_images/kt00.png"
    ],
    "github": "https://github.com/khushnood956/Money-Manager-App",
    "live": "#",
    "featured": true,
    "problem": "Personal finance trackers are often bloated with ads, require cloud syncing, or feature confusing multi-layer menus that deter quick logging on-the-go.",
    "architecture": "Built with the Android SDK using a Single Activity Architecture. Utilizes Kotlin for application logic, XML layout files with material design styles, and an SQLite database for persistent offline storage of financial data.",
    "challenges": "Ensuring the UI reflects new transactions immediately and dynamically recalculates account balances without causing performance stuttering.",
    "learnings": "Gained experience in Kotlin programming, Android life-cycles, UI layout management using constraint layouts, and handling SQL CRUD query executions via SQLiteOpenHelper.",
    "futureImprovements": "Migrate from raw SQLite to Room Database for type-safe database queries, implement Jetpack Compose for UI rendering, and generate visual monthly charts (e.g. Pie charts) for expense categories."
  },
  {
    "id": 1,
    "title": "Hospital Management System",
    "tagline": "Command-line healthcare administrative application built with strict Java OOP design patterns.",
    "description": "A highly structured command-line application built to simulate clinical administration workflows. It manages medical records, patient intakes, doctor allocations, and departmental organizing using pure Java object-oriented principles.",
    "category": "Backend Core",
    "techStack": [
      "Java",
      "OOP",
      "Collections Framework",
      "Data Structures"
    ],
    "image": "project_images/hp03.png",
    "images": [
      "project_images/hp03.png",
      "project_images/hp02.png",
      "project_images/hp01.png"
    ],
    "github": "https://github.com/khushnood956/Hospital-Management-System",
    "live": "#",
    "featured": true,
    "problem": "Healthcare facilities often face bottlenecks in patient intake, doctor assignment, and department organization due to manual record-keeping or inefficient desktop tooling.",
    "architecture": "Designed using clean Model-View-Controller separation. Built with modular Services (PatientService, DoctorService, DepartmentService) managing core operations, interacting with data-holder models. Utilizes Java Collections (Lists, HashMaps) for in-memory relationships.",
    "challenges": "Managing cross-references between patients, doctors, and departments (e.g., maintaining reciprocal relationships) in memory without a relational database engine.",
    "learnings": "Deepened understanding of Java object relationships, referencing, collection lookup performance (O(1) HashMaps vs O(N) lists), and the design of user-friendly terminal-based interface navigation loops.",
    "futureImprovements": "Plan to add a persistent relational database layer (MySQL) using JDBC or Spring Data JPA, and build a RESTful API layer above the core service."
  },
  {
    "id": 2,
    "title": "Inventory Management System",
    "tagline": "C++ CLI system for dynamic stock tracking utilizing a custom Singly Linked List implementation.",
    "description": "A performance-focused console application that tracks commercial inventories. It implements a custom linked list structure rather than language templates to maximize control over memory allocation and show underlying data structure mechanics.",
    "category": "Programming Core",
    "techStack": [
      "C++",
      "Data Structures",
      "Linked Lists",
      "Memory Management"
    ],
    "image": "project_images/in01.png",
    "images": [
      "project_images/in01.png",
      "project_images/in02.png",
      "project_images/in03.png"
    ],
    "github": "https://github.com/khushnood956/Inventory-Management-System",
    "live": "#",
    "featured": true,
    "problem": "Standard template libraries can abstract away memory usage, making it difficult to understand pointer mechanics and overhead optimization when handling lists of products in low-resource environments.",
    "architecture": "Constructed with a custom Singly Linked List class (`ProductList`). Each node stores a `Product` object and a pointer to the next element. Implements search, insertion, deletion, and sorting operations by traversing pointers manually.",
    "challenges": "Preventing memory leaks and handling pointer references when deleting elements from the middle of the inventory list.",
    "learnings": "Mastered pointer manipulation, dynamic memory allocation using `new` and `delete`, proper destructor design to release memory, and implementing traversal logic for sorted insertions.",
    "futureImprovements": "Implement a Doubly Linked List to support reverse traversal for better sorting efficiency (e.g. bubble sort/insertion sort) and add CSV export capabilities."
  },
  {
    "id": 8,
    "title": "Banking Management System",
    "tagline": "Safe Java simulation of a transactional ledger with balance tracking and transaction history logging.",
    "description": "A Java desktop application that handles simulated financial ledgers. It supports account opening, money deposit/withdrawal limits, balance checks, and logs an immutable ledger of transactions for security auditing.",
    "category": "Backend Core",
    "techStack": [
      "Java",
      "System Security",
      "OOP",
      "Transaction Logic"
    ],
    "image": "project_images/banking.png",
    "images": [
      "project_images/banking.png"
    ],
    "github": "https://github.com/khushnood956/Banking-Management-System",
    "live": "#",
    "featured": false,
    "problem": "Financial software requires zero-tolerance calculations, security rules, and audit logs to prevent data inconsistencies or balance tampering.",
    "architecture": "Constructed with separate logic structures: an Account controller guarding balance rules, a Ledger logger recording state changes, and a menu router.",
    "challenges": "Preventing state validation bypasses (such as negative withdrawals or overdrafts) and handling exceptions cleanly in terminal loops.",
    "learnings": "Practiced designing robust exception hierarchies, input validation patterns, and writing immutable data streams for transaction histories.",
    "futureImprovements": "Convert to a Spring Boot service, secure it with JWT Authentication, and add database storage using PostgreSQL."
  },
  {
    "id": 7,
    "title": "To-Do List Manager",
    "tagline": "Core Java console utility featuring task management, priorities, and file-based state serialization.",
    "description": "A desktop terminal utility designed in Java to track personal schedules. It implements persistent file storage and lets users add, check off, prioritize, and delete tasks dynamically.",
    "category": "Programming Core",
    "techStack": [
      "Java",
      "Serialization",
      "File IO",
      "OOP Design"
    ],
    "image": "project_images/todolist.png",
    "images": [
      "project_images/todolist.png"
    ],
    "github": "https://github.com/khushnood956/Todo-List",
    "live": "#",
    "featured": false,
    "problem": "Users need lightweight command-line productivity tools that maintain state between terminal sessions without heavy SQL dependencies.",
    "architecture": "Designed using an OOP structure: Task model, TaskList container, and FileHandler utility. Serialization writes Java objects directly to files and deserializes them on startup.",
    "challenges": "Ensuring smooth parsing of date formats and handling serialization version incompatibilities when updating task class attributes.",
    "learnings": "Understood the details of Java serialization API (`Serializable`, `ObjectOutputStream`, `ObjectInputStream`), custom exceptions, and CLI layout formatting.",
    "futureImprovements": "Refactor data serialization to JSON using Gson/Jackson to improve readability and cross-language interoperability."
  },
  {
    "id": 6,
    "title": "Sudoku Solver & Game",
    "tagline": "Terminal-based interactive Sudoku puzzle with a recursive backtracking solver in Python.",
    "description": "An interactive console-based Sudoku game. It includes an algorithmic solver that uses recursive depth-first backtracking to complete boards of any difficulty level in milliseconds.",
    "category": "Programming Core",
    "techStack": [
      "Python",
      "Backtracking Algorithms",
      "Recursion",
      "Constraint Satisfaction"
    ],
    "image": "project_images/sodoku.png",
    "images": [
      "project_images/sodoku.png"
    ],
    "github": "https://github.com/khushnood956/Sudoku-Solver-Game",
    "live": "#",
    "featured": false,
    "problem": "Generating valid Sudoku boards and designing automated algorithms that can solve complex, constraint-heavy logic puzzles efficiently.",
    "architecture": "Implemented using a grid modeling system. The solver function employs a depth-first search (DFS) recursion that checks constraints (row, column, and 3x3 block uniqueness) at each step. If a cell has no valid choices, the call stack backtracks.",
    "challenges": "Handling high recursion call counts and optimizing search paths to avoid testing millions of invalid combinations on harder boards.",
    "learnings": "Gained a deep understanding of recursive functions, backtracking patterns, constraint-satisfaction problems, and array traversal optimizations.",
    "futureImprovements": "Implement the Minimum Remaining Values (MRV) heuristic to choose cells with the fewest candidates first, drastically reducing search paths."
  },
  {
    "id": 12,
    "title": "PropInsight",
    "tagline": "Data-driven real estate discovery, comparison, and investment analysis.",
    "category": "Backend Core",
    "techStack": [
      "PHP 8.3",
      "Laravel",
      "Blade",
      "MySQL",
      "Eloquent ORM",
      "Bootstrap 5.3",
      "JavaScript",
      "Vite",
      "Custom CSS"
    ],
    "image": "project_images/prop1.png",
    "images": [
      "project_images/prop1.png",
      "project_images/prop2.png",
      "project_images/prop3.png",
      "project_images/prop4.png"
    ],
    "github": "https://github.com/khushnood956/PropInsight-WebTech_project",
    "live": "#",
    "featured": false,
    "description": "PropInsight is a Laravel-based real estate analytics platform that lets users browse, filter, compare, and analyze properties with market trend data and mortgage/ROI calculations.",
    "problem": "Static property listings are hard to search, compare, and evaluate, so this project centralizes discovery and investment analysis in one place.",
    "architecture": "Laravel MVC with routing, controllers, Eloquent models, Blade views, MySQL tables for cities, property types, properties, images, and market trends, plus session-based comparison.",
    "challenges": "Building multi-criteria search and filtering, avoiding N+1 queries with eager loading, managing 3-property comparison state in the session, and implementing financial calculations cleanly.",
    "learnings": "Laravel routing, controller design, Blade layout inheritance, Eloquent relationships, server-side validation, pagination, and session state management.",
    "futureImprovements": "Add authentication, admin CRUD for properties, saved favorites, real-time market data integration, and richer i"
  },
  {
    "id": 13,
    "title": "CareSync",
    "tagline": "Secure hospital appointment scheduling and clinical workflow management system",
    "category": "Backend Core",
    "techStack": [
      "Java 21",
      "Spring Boot 3.3.0",
      "Spring Security",
      "Spring Data JPA",
      "Hibernate",
      "JWT",
      "MySQL 8",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Bootstrap 5",
      "Chart.js",
      "JUnit 5",
      "Mockito",
      "MockMvc"
    ],
    "image": "project_images/crs1.png",
    "images": [
      "project_images/crs1.png",
      "project_images/crs2.png",
      "project_images/crs3.png",
      "project_images/crs4.png",
      "project_images/crs5.png",
      "project_images/crs6.png",
      "project_images/crs7.png"
    ],
    "github": "https://github.com/khushnood956/CareSync",
    "live": "#",
    "featured": true,
    "description": "CareSync is role-based hospital appointment scheduling platform that streamlines patient booking, doctor slot management, and admin oversight with secure authentication and audit logging",
    "problem": "Replaces manual hospital scheduling with a secure digital workflow for booking, rescheduling, canceling, and managing appointments across patients, doctors, and administrators.",
    "architecture": "Layered Spring Boot architecture with controllers, services, repositories, entities, DTOs, and security filters. JWT-based authentication, role-based access control, JPA persistence, and a MySQL-backed data layer support patient, doctor, admin, and reporting modules.",
    "challenges": "Preventing double-bookings, enforcing the 24-hour cancellation and rescheduling rule, securing role-based access with JWT, protecting against XSS, and handling safe deletion of doctors and departments without breaking data integrity.",
    "learnings": "Building stateless authentication in Spring Security, modeling domain relationships with JPA, enforcing business rules through service-layer validation, sanitizing user input safely, and testing business logic with JUnit, Mockito, and MockMvc.",
    "futureImprovements": "Add appointment reminders, calendar integration, richer analytics exports, file uploads for clinical records, pagination and search enhancements, and a more polished mobile-friendly UI."
  }
];
