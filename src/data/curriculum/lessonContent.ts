import type {
  CodeExample,
  Comparison,
  LessonSection,
  LessonSummary,
  PracticalChallenge,
} from '../../types/curriculum.ts'

/** Prose and exercises for published lessons. Planned lessons have none yet. */
export const lessonSections: LessonSection[] = [
  {
    id: 'section-1-1-1',
    order: 1,
    title: 'Why Should You Learn System Design?',
    kind: 'introduction',
    paragraphs: [
      'Imagine an online store that starts with 10 users, 100 products, one application server and one database. At this size, correct code and a simple deployment can be enough. Design is still happening, but it can stay informal.',
      'Now imagine the same store serving 100,000 users, millions of products and thousands of simultaneous requests. A query that felt instant can become slow. One server can become a bottleneck. A bug or a deploy can affect every customer.',
      'System design is the practice of deciding how the parts of an application fit together so it keeps working as needs change. Correct code is necessary, but code alone does not answer how traffic is distributed, where data is stored, what happens when a dependency fails, or how the system will be changed later.',
      'This lesson does not claim that every small application needs a distributed architecture. The goal is to recognise when a simple architecture is a deliberate choice and when growth calls for a different conversation.',
    ],
    keyPoints: [
      'Small systems can succeed with simple architecture.',
      'Growth changes traffic, data, failure and change-management problems.',
      'Writing correct code is necessary but not sufficient for a successful system.',
    ],
  },
  {
    id: 'section-1-1-2',
    order: 2,
    title: 'What Is System Design?',
    kind: 'concepts',
    paragraphs: [
      'System design is the process of defining how software components work together to satisfy requirements and constraints. Components are the parts that perform work. Responsibilities describe what each part owns. Communication describes how parts exchange information. Data flow describes where information goes. Storage describes what survives between requests. Infrastructure is the environment that runs and connects everything.',
      'A design also records architectural decisions: which component owns each responsibility, which paths requests take, what happens on failure, and which trade-offs are acceptable. Requirements say what the system must do and how well. Constraints limit the choices, such as budget, team size, deadlines or existing technology.',
      'Coding implements individual features and algorithms inside a chosen structure. System design decides the structure itself. For an online store, coding might implement a product search function. System design decides whether search runs in the application server, uses a separate search index, needs a cache, and how product data stays correct when it changes.',
    ],
    keyPoints: [
      'Design is about structure, interaction and constraints, not a list of technologies.',
      'Coding asks how to implement a feature; system design asks how the parts work together.',
      'A design should be explainable before it is implemented.',
    ],
  },
  {
    id: 'section-1-1-3',
    order: 3,
    title: 'A Real-World Analogy',
    kind: 'concepts',
    paragraphs: [
      'A restaurant is a useful analogy because many people must cooperate to complete an order. Customers place requests. Waiters carry orders and responses. The kitchen prepares the product. Storage holds ingredients. A payment step records the transaction. Coordination makes sure the right order reaches the right table.',
      'The mapping is straightforward: customers are clients; waiters resemble the API and request path; the kitchen is the application server executing logic; storage is the database; a small counter of popular ready-to-serve items behaves like a cache; the payment step is part of the business workflow; the manager coordinating staff resembles infrastructure and operational process.',
      'The analogy helps explain responsibilities and handoffs: no single person does everything, and the connections between people matter. It has limits. Software can be copied instantly, requests can arrive concurrently at enormous scale, and a server can fail and restart in ways a kitchen cannot. Use the analogy to build intuition, then return to the technical model.',
    ],
    keyPoints: [
      'The analogy shows why responsibilities and handoffs matter.',
      'It is not a technical specification.',
      'Return to precise component names when designing software.',
    ],
  },
  {
    id: 'section-1-1-4',
    order: 4,
    title: 'Main Building Blocks of a Software System',
    kind: 'concepts',
    paragraphs: [
      'A client is the application or device that initiates a request: a browser, mobile app, command-line tool or another service. It represents the user or caller and gives people an interface to the system. For example, a shopper’s browser requests a product page.',
      'A server receives requests and runs application logic. It exists to apply rules that should not live in the client, such as checking prices or validating orders. It solves the problem of centralising behaviour and data access. For example, the store server calculates the final basket total.',
      'An API, or application programming interface, is the contract between components: the allowed requests, expected data and response format. It exists so components can collaborate without sharing internal code. It solves the problem of unclear handoffs. For example, GET /products/42 returns one product as JSON.',
      'A database stores and retrieves persistent data that must survive restarts. It solves the problem of losing important state when a process ends. For example, the product catalogue and placed orders live in a database.',
      'A cache is a faster storage layer that keeps a copy of data or a computed result so repeated expensive work can be avoided. It reduces repeated reads and latency, but it can serve stale data until it is refreshed or invalidated. For example, recently viewed product details can be kept in a cache.',
      'A load balancer distributes incoming traffic across multiple servers. It prevents one server from receiving every request and can keep a service reachable when one instance fails. For example, product-page requests can be spread across two application servers.',
      'A message queue allows work to be communicated and processed asynchronously: one component places a message, and another processes it later. It reduces coupling and absorbs bursts for work that need not finish during the original request. For example, an order confirmation email can be sent after checkout responds.',
    ],
    keyPoints: [
      'Clients request, servers decide, APIs define the contract and databases remember.',
      'Caches speed repeated reads, load balancers spread traffic and queues defer work.',
      'These components are optional; add one only when a requirement or measured problem justifies it.',
      'Every component adds responsibility and operational cost.',
    ],
  },
  {
    id: 'section-1-1-5',
    order: 5,
    title: 'How Components Work Together',
    kind: 'process',
    paragraphs: [
      'A product page request is a good example of data flow: the client asks for information, the server applies rules, and a response returns. The first diagram after this section shows the simplest version of that path.',
      'A request is the message sent by the caller. A response is the result returned. Data flow is the route information takes. Component responsibility is the work each part owns. Keeping these ideas separate makes a design easier to reason about.',
    ],
    steps: [
      {
        id: 'step-1-1-5-1',
        title: 'Client sends a request',
        description: 'The browser sends GET /products/42 to the store API because the shopper opened that product page.',
      },
      {
        id: 'step-1-1-5-2',
        title: 'Request reaches the server',
        description: 'The network delivers the request to the application server, which validates the route and the product id.',
      },
      {
        id: 'step-1-1-5-3',
        title: 'Server processes the request',
        description: 'The server applies business rules, such as checking that the product is active and visible to customers.',
      },
      {
        id: 'step-1-1-5-4',
        title: 'Server checks the cache',
        description: 'The server looks for a recent copy of product 42. If it is present, this read can skip the database.',
      },
      {
        id: 'step-1-1-5-5',
        title: 'Server queries the database if needed',
        description: 'On a cache miss, the server reads the durable product data and may store a copy in the cache for later reads.',
      },
      {
        id: 'step-1-1-5-6',
        title: 'Server prepares the response',
        description: 'The server formats the product data as a response with a status, headers and a JSON body.',
      },
      {
        id: 'step-1-1-5-7',
        title: 'Client displays the product',
        description: 'The browser renders the name, price and image. The request ends, while durable data remains in the database.',
      },
    ],
    keyPoints: [
      'Not every request touches every component.',
      'A cache hit avoids a database read; a cache miss allows one.',
      'Name responsibilities explicitly instead of saying that the system handles it.',
    ],
  },
  {
    id: 'section-1-1-6',
    order: 6,
    title: 'Functional Requirements',
    kind: 'concepts',
    paragraphs: [
      'Functional requirements describe what a system must do: the capabilities and behaviour that a user or another system can observe. They are written from the outside, not from the implementation.',
      'For our store, the initial functional requirements include: users can register; users can log in; users can browse products; users can add products to a basket; users can place orders; and users can track orders.',
      'Clear requirements are testable. “A registered user can place an order containing items that are currently in stock” can be checked. “The store should work well” cannot. Vague requirements hide decisions and make validation difficult.',
    ],
    keyPoints: [
      'Functional means behaviour or capability.',
      'Write an actor, an action and an observable result.',
      'Prefer testable statements over adjectives.',
    ],
  },
  {
    id: 'section-1-1-7',
    order: 7,
    title: 'Non-Functional Requirements',
    kind: 'concepts',
    paragraphs: [
      'Performance describes how quickly the system responds and how much work it processes. For example, a product page might be required to return within 200 ms at a stated request rate. It matters because slow systems feel broken even when they are functionally correct. Performance is not only a database issue; network time, code, cache misses and contention can all contribute.',
      'Scalability is the ability to handle increasing workload by adding resources without redesigning everything. For example, the store might need to serve 10,000 concurrent users by adding application instances and caching product reads. Scalability does not automatically mean microservices; a well-structured monolith can scale for many workloads.',
      'Availability is how consistently the system remains accessible, often expressed as a target such as 99.9% over a period. For example, customers might still browse cached products when one application instance fails. Availability does not mean that components never fail; good designs expect failure and keep the service reachable.',
      'Reliability is how consistently the system behaves correctly over time. For example, an order should be recorded once and a customer should not be charged twice. Reliability matters because silent wrong results can be worse than visible downtime. Availability asks whether users can reach the system; reliability asks whether its results are correct. A service can be available while returning the wrong order total.',
      'Security protects users, data and operations. For example, passwords are hashed, payment data is encrypted in transit, and customers can see only their own orders. Security is not a final checklist; it shapes APIs, storage and deployment from the start.',
      'Maintainability is how easily developers can understand, modify and extend the system. For example, a new developer should be able to locate order logic and add a delivery status without reading unrelated code. It includes clear ownership, documentation and simple operational procedures, not just tidy source code.',
    ],
    keyPoints: [
      'Non-functional requirements describe qualities: how well the system behaves.',
      'Availability asks Can users reach it? Reliability asks Does it behave correctly?',
      'These requirements are not decoration; they drive component choices and trade-offs.',
    ],
  },
  {
    id: 'section-1-1-8',
    order: 8,
    title: 'Functional vs Non-Functional Requirements',
    kind: 'concepts',
    paragraphs: [
      'Both categories are necessary. Functional requirements define the features a user can point to. Non-functional requirements define the qualities that make those features usable at the required scale and risk level.',
      'A system can satisfy every functional requirement and still fail if it is too slow, unavailable, insecure or impossible to change. Conversely, a fast and reliable system that cannot place orders is not useful.',
      'The comparison below uses the store examples. Notice that a statement becomes measurable when it includes a condition such as a response time under a specified workload or a defined service level.',
    ],
    keyPoints: [
      'Functional answers what; non-functional answers how well.',
      'Requirements should be measurable wherever possible.',
      'Trade-offs often happen because these two categories pull in different directions.',
    ],
  },
  {
    id: 'section-1-1-9',
    order: 9,
    title: 'Why Trade-offs Matter',
    kind: 'tradeoffs',
    paragraphs: [
      'An architectural decision usually improves one quality by giving up another. A trade-off is not a mistake; it is an explicit choice made with requirements in mind.',
      'There is rarely one universally best architecture. The right design depends on workload, constraints, team skill, budget and priorities. A design that is excellent for a small store may be unnecessary or even harmful for a different product.',
      'At this stage, name the gain and the cost in plain language. Detailed topics such as CAP theorem come later; the habit here is to ask what improves and what is accepted in return.',
    ],
    tradeoffs: [
      {
        id: 'tradeoff-1-1-cache',
        choice: 'Cache popular product pages',
        benefit: 'Faster reads and less database load.',
        cost: 'Cached data can be stale until it is refreshed or invalidated.',
      },
      {
        id: 'tradeoff-1-1-latency',
        choice: 'Tune for lower read latency',
        benefit: 'Responses return sooner for users.',
        cost: 'May require more infrastructure or weaker consistency for some reads.',
      },
      {
        id: 'tradeoff-1-1-simplicity',
        choice: 'Keep one application server',
        benefit: 'Simpler deployment, debugging and ownership.',
        cost: 'Less capacity and a larger failure impact as traffic grows.',
      },
      {
        id: 'tradeoff-1-1-redundancy',
        choice: 'Add redundant application servers',
        benefit: 'Higher availability when one instance fails.',
        cost: 'More coordination, configuration and operational work.',
      },
    ],
    keyPoints: [
      'No architecture is best in every context.',
      'State the cost beside the benefit.',
      'Revisit trade-offs when requirements change.',
    ],
  },
  {
    id: 'section-1-1-10',
    order: 10,
    title: 'How to Approach a System Design Problem',
    kind: 'process',
    paragraphs: [
      'Beginners often jump to technologies. That reverses the problem: a technology is a possible answer, but you need the question first. The workflow below turns a vague request into a defensible design.',
      'For a small store, this might mean confirming that browsing, registration, basket and checkout are in scope; agreeing that launch traffic is modest; choosing one application server and one database; and noting that a cache is a future option if reads become slow. The output can still be simple. What matters is that each choice has a reason.',
      'The same workflow is used in real engineering planning and in system design interviews. Interviewers and reviewers are not looking for a famous architecture. They want to see requirement questions, clear responsibilities, data flow and explicit trade-offs under constraints.',
    ],
    steps: [
      {
        id: 'step-1-1-10-1',
        title: 'Understand the problem',
        description: 'Restate the goal and identify who uses the system and what outcome they need.',
      },
      {
        id: 'step-1-1-10-2',
        title: 'Gather functional requirements',
        description: 'List the capabilities and observable behaviours that are in scope.',
      },
      {
        id: 'step-1-1-10-3',
        title: 'Gather non-functional requirements',
        description: 'Ask about performance, scalability, availability, reliability, security and maintainability.',
      },
      {
        id: 'step-1-1-10-4',
        title: 'Identify constraints',
        description: 'Record budget, timeline, team skills, compliance needs and existing systems.',
      },
      {
        id: 'step-1-1-10-5',
        title: 'Estimate workload when necessary',
        description: 'Use rough numbers for users, requests and data when scale could change the design.',
      },
      {
        id: 'step-1-1-10-6',
        title: 'Identify the main components',
        description: 'Name clients, servers, stores and optional helpers, then state one responsibility for each.',
      },
      {
        id: 'step-1-1-10-7',
        title: 'Define communication and data flow',
        description: 'Describe the APIs, request paths and where data is written or read.',
      },
      {
        id: 'step-1-1-10-8',
        title: 'Consider bottlenecks and failure scenarios',
        description: 'Ask what happens if a server is overloaded, a cache is empty or a dependency is unavailable.',
      },
      {
        id: 'step-1-1-10-9',
        title: 'Evaluate trade-offs',
        description: 'For each important choice, write the gain and the cost in plain language.',
      },
      {
        id: 'step-1-1-10-10',
        title: 'Review and improve the design',
        description: 'Check the design against the requirements and revise it; do not add components without a reason.',
      },
    ],
    keyPoints: [
      'Requirements and constraints come before technology selection.',
      'A first design can be small if the reasoning is explicit.',
      'Iterate instead of trying to produce a perfect diagram on the first pass.',
    ],
  },
  {
    id: 'section-1-1-11',
    order: 11,
    title: 'Common Mistakes',
    kind: 'mistakes',
    paragraphs: [
      'These mistakes are common because they produce visible activity: selecting a framework, drawing many boxes or producing a neat diagram. Good system design is less about looking sophisticated and more about making explicit, testable decisions.',
    ],
    commonMistakes: [
      'Choosing technologies before understanding requirements. It feels productive to name databases and frameworks early, but those choices cannot be judged without a target. Write requirements first and let them eliminate options.',
      'Assuming microservices are always better than monoliths. Microservices sound modern, yet they add network calls, deployment complexity and failure modes. Start with the simplest structure that meets the requirements and split only when a real boundary or scaling need appears.',
      'Ignoring non-functional requirements. Feature lists are easy to see, so speed, availability and security often get skipped. Ask how well the system must behave and attach measurable targets where possible.',
      'Designing for imaginary future scale. Adding queues, clusters and caches for traffic that may never arrive increases cost and complexity. Design for known needs and watch for signals that indicate real growth.',
      'Adding unnecessary components. A diagram with many boxes can look impressive, but every box needs an owner and an operational cost. Include a component only when you can explain the problem it solves.',
      'Confusing availability with reliability. A service can answer every request with the wrong order total. Ask both whether users can reach the system and whether its results are correct.',
      'Focusing only on diagrams without explaining decisions. Boxes and arrows do not show why a choice fits the requirements. Accompany each diagram with responsibilities, data flow, failure behaviour and trade-offs.',
    ],
    keyPoints: [
      'Ask why this component exists before adding it.',
      'Prefer a simple design that can be justified over a complex design that looks impressive.',
    ],
  },
  {
    id: 'section-1-1-12',
    order: 12,
    title: 'Key Takeaways',
    kind: 'concepts',
    paragraphs: [
      'System design turns requirements and constraints into a structure of components, communication and data flow. It begins with questions, not technology names.',
      'As systems grow, small choices about storage, caching, traffic distribution and failure handling become important. Each choice has a benefit and a cost, so trade-offs must be stated openly.',
      'Use the workflow in this lesson as a checklist: understand the problem, write both requirement types, name responsibilities, trace data, examine failure and revise.',
    ],
    keyPoints: [
      'System design defines how the complete application is structured.',
      'The main building blocks are clients, servers, APIs, databases, caches, load balancers and message queues.',
      'Functional requirements say what the system does; non-functional requirements say how well it does it.',
      'Scalability, availability, reliability and performance are distinct qualities that must be explicit.',
      'Every architectural choice has a gain and a cost.',
      'Requirement-first thinking keeps the design small, explainable and adaptable.',
    ],
  },
  {
    id: 'section-1-2-1',
    order: 1,
    title: 'Introduction: How Do Applications Communicate?',
    kind: 'introduction',
    paragraphs: [
      'Imagine opening an online shopping app and tapping View Product. You see a product name, price and photograph, yet none of those details were invented by the app on your screen. The app asked another program for the data, received an answer and turned that answer into something you can read.',
      'The interaction has four parts. A person interacts with an application. The application needs data it does not hold locally. Another component receives the request, processes it and finds the data. The result travels back and is displayed to the person. Software components communicate whenever one needs information or behaviour that another component owns.',
      'Understanding this exchange is fundamental to system design. Almost every design question eventually asks which component starts an interaction, which component responds, what information crosses the boundary and what happens when the path fails. Once you can trace that path, diagrams of larger systems become much easier to read.',
    ],
    keyPoints: [
      'A user action often becomes a request from one program to another.',
      'The response is returned to the caller and rendered by the client.',
      'Communication paths are a core system design concern because they define ownership and failure behaviour.',
    ],
  },
  {
    id: 'section-1-2-2',
    order: 2,
    title: 'What Is a Client?',
    kind: 'concepts',
    paragraphs: [
      'A client is a program that initiates an interaction by sending a request to another program. It acts on behalf of a user or a calling system. The word describes a role in a relationship, not a particular device or technology.',
      'Client responsibilities usually include collecting user input, presenting a user interface, preparing requests with the required information and displaying or handling responses. A client may validate simple input early, such as checking that an email field is not empty, but important business rules should not rely only on the client.',
      'Common examples include a web browser, a mobile application, a desktop application and a backend service that calls another service. The last example is important: a client is not necessarily human-facing. A billing service that asks a catalogue service for product prices is acting as a client even though nobody clicks a button in it.',
    ],
    keyPoints: [
      'A client starts a request and handles the returned response.',
      'User interface, input collection, request preparation and display are typical client responsibilities.',
      'A client can be another backend service, not only a browser or mobile app.',
    ],
  },
  {
    id: 'section-1-2-3',
    order: 3,
    title: 'What Is a Server?',
    kind: 'concepts',
    paragraphs: [
      'A server is a program that listens for requests, processes them and returns responses. It owns behaviour that callers should not implement themselves, such as applying business rules, checking permissions, reading or writing shared data and deciding which result is valid.',
      'When a request arrives, server software parses it, validates what it can, applies application logic, accesses a data store when needed and builds a response. The response normally includes a status that says whether the request succeeded and a body that carries the result or an error description.',
      'People use the word server for several related ideas. A web server serves web content; an application server runs application logic; an API server exposes a contract that other programs can call. The physical machine is a separate concern: server software can run on a physical machine, a virtual machine, a container or a managed cloud service. Saying “the server rejected the request” usually means the server program made that decision.',
    ],
    keyPoints: [
      'A server receives requests, applies logic, accesses data and returns responses.',
      'Server software centralises rules that should be consistent for every caller.',
      'Server is usually a software role; the hosting environment may be physical, virtual, containerised or cloud-managed.',
    ],
  },
  {
    id: 'section-1-2-4',
    order: 4,
    title: 'Client-Server Architecture',
    kind: 'tradeoffs',
    paragraphs: [
      'Client-server architecture divides a system into clients that request work and servers that provide it. The two roles communicate over a network. Clients initiate interactions; servers listen, process and respond. This separation lets each side focus on a different responsibility.',
      'A purely local application keeps its interface, rules and data in one process on one machine. That can be simple and fast for a single user, but shared data and consistent rules are difficult when several people or devices need the same information. Client-server architecture moves shared logic and data behind a common boundary so multiple clients can use the same backend.',
      'The model is not free. Every call crosses a network, so latency and failures are now part of the design. Server availability matters because clients depend on it, and a popular server can become a bottleneck. Good designs state these costs openly rather than assuming the network is perfect.',
    ],
    tradeoffs: [
      {
        id: 'tradeoff-1-2-centralised-logic',
        choice: 'Centralise business rules on the server',
        benefit: 'Every client receives the same behaviour and pricing rules.',
        cost: 'Clients depend on the server being reachable and correct.',
      },
      {
        id: 'tradeoff-1-2-shared-resources',
        choice: 'Share one backend across web, mobile and service clients',
        benefit: 'Data and rules have one authoritative home.',
        cost: 'The API contract must be designed and evolved for several callers.',
      },
      {
        id: 'tradeoff-1-2-updates',
        choice: 'Update server logic without rewriting every client',
        benefit: 'Many behaviour changes can be deployed once on the backend.',
        cost: 'Breaking contract changes can still force client updates.',
      },
      {
        id: 'tradeoff-1-2-network',
        choice: 'Move work across a network boundary',
        benefit: 'Clients can be thin and data can be centrally managed.',
        cost: 'Latency, outages and partial failures must be handled explicitly.',
      },
    ],
    keyPoints: [
      'Separation of responsibilities is the defining idea of client-server architecture.',
      'Multiple clients can reuse one backend and its shared data.',
      'Network dependency, server availability, latency and bottlenecks are the main costs.',
    ],
  },
  {
    id: 'section-1-2-5',
    order: 5,
    title: 'Request-Response Model',
    kind: 'process',
    paragraphs: [
      'Client-server communication is often described with a request-response model. The client sends a message that asks for an action, and the server sends back a message that reports the outcome. HTTP is a common protocol for this exchange on the web, but this lesson stays at the level of the pattern rather than exploring every HTTP rule.',
      'A request usually has a method, a URL, headers and sometimes a body. The method says what the caller wants to do, such as GET to retrieve data. The URL identifies the resource. Headers carry metadata such as the accepted response format. The body, when present, carries data such as a form submission.',
      'A response has a status code, headers and often a body. A status code such as 200 means success, while 404 means the resource was not found and 500 signals a server-side problem. For a product API, GET /products/42 asks for product 42 and might return a 200 status with JSON product data. The client then decides what to display.',
    ],
    steps: [
      {
        id: 'step-1-2-5-1',
        title: 'User performs an action',
        description: 'A shopper clicks a product tile in the interface.',
      },
      {
        id: 'step-1-2-5-2',
        title: 'Client prepares a request',
        description: 'The app builds an HTTP GET request with a method, URL and headers.',
      },
      {
        id: 'step-1-2-5-3',
        title: 'Request travels over the network',
        description: 'The bytes move across local and remote network links to the server.',
      },
      {
        id: 'step-1-2-5-4',
        title: 'Server receives the request',
        description: 'Server software accepts the connection and reads the method, URL and headers.',
      },
      {
        id: 'step-1-2-5-5',
        title: 'Server processes the request',
        description: 'It validates the request, applies rules and reads or writes data as needed.',
      },
      {
        id: 'step-1-2-5-6',
        title: 'Server prepares a response',
        description: 'It chooses a status code, adds headers and places the result or error in the body.',
      },
      {
        id: 'step-1-2-5-7',
        title: 'Response travels back',
        description: 'The network delivers the response to the waiting client.',
      },
      {
        id: 'step-1-2-5-8',
        title: 'Client handles and displays the result',
        description: 'The client checks the status, reads the body and renders data or a clear error.',
      },
    ],
    keyPoints: [
      'A request contains a method, URL, headers and an optional body.',
      'A response contains a status code, headers and an optional body.',
      'HTTP is the common web protocol, but the request-response pattern is the concept to learn here.',
    ],
  },
  {
    id: 'section-1-2-6',
    order: 6,
    title: 'Real Request Walkthrough',
    kind: 'process',
    paragraphs: [
      'Consider a customer who clicks View Product for product 42. The browser creates a GET request for /api/products/42. The network carries that request to the API server. The endpoint reads the product id, asks the application logic to fetch the product and the data tier returns the stored row. The server turns the result into a 200 response with JSON, and the browser renders the product page.',
      'Each component has a narrow job. The browser owns user interaction and display. The network moves bytes but does not understand product rules. The API translates the HTTP request into an internal operation. Application logic decides what a valid product request means. The database returns durable data. The response path reverses the direction of the request while keeping those responsibilities distinct.',
      'Failures are part of the same story. If the network is unavailable, the browser can show a connection error and offer a retry. If the server is unavailable, the request cannot be processed and the client should avoid presenting stale data as a fresh result. A 404 means the product was not found, so the client can show a helpful not-found message. A 400 means the request was invalid, so the client should correct what it sent. A 500 means the server failed; the client can report a temporary problem and log enough context for investigation.',
      'The linked simulation below lets you step through this same lifecycle one stage at a time. Watch which component is active, when the request changes direction and when the response is formed. Manual stepping makes the invisible network path visible and helps you connect each stage to the code examples later in the lesson.',
    ],
    steps: [
      {
        id: 'step-1-2-6-1',
        title: 'Browser',
        description: 'Captures the click and sends GET /api/products/42 with an Accept header.',
      },
      {
        id: 'step-1-2-6-2',
        title: 'Network',
        description: 'Carries the request to the API host and later carries the response back.',
      },
      {
        id: 'step-1-2-6-3',
        title: 'Backend API',
        description: 'Matches the route, reads the id and calls the product logic.',
      },
      {
        id: 'step-1-2-6-4',
        title: 'Application logic',
        description: 'Checks that the id is valid and that the product may be shown.',
      },
      {
        id: 'step-1-2-6-5',
        title: 'Database',
        description: 'Returns the stored product row for the requested id.',
      },
      {
        id: 'step-1-2-6-6',
        title: 'Response',
        description: 'The server sends 200 with JSON, or a 400, 404 or 500 result; the client handles each outcome.',
      },
    ],
    keyPoints: [
      'A product request passes through the browser, network, API, logic and data store.',
      'Every component should own one clear part of the interaction.',
      'Network failure, server failure, missing products and invalid requests need different client responses.',
    ],
  },
  {
    id: 'section-1-2-7',
    order: 7,
    title: 'Stateless vs Stateful Communication',
    kind: 'concepts',
    paragraphs: [
      'In stateless communication, the server does not rely on stored session context from earlier requests to understand the current one. Each request carries the information needed to process it. A REST-style API often follows this approach: a request to read product 42 includes the product id and any authentication token the server needs, so the server can handle it without remembering a previous click.',
      'Statelessness can make horizontal scaling easier in suitable architectures because any server instance can handle the next request without copying a user session. It does not mean the application stores no data. The database still holds products and orders, and a cache may still hold temporary copies. The claim is narrower: the protocol interaction does not require the server to remember a conversation between requests.',
      'In stateful communication, the server maintains interaction or session state across requests. A login session stored on the server, a long-lived connection with connection state and a multi-step checkout workflow are examples. State can improve user experience or make sense when a sequence of steps belongs together, but it requires the next request to reach a server that can access that state, or requires state to be shared between instances.',
      'HTTP is commonly described as stateless because each request is independent at the protocol level. Applications built on HTTP can still be stateful: cookies, server-side sessions and authentication tokens are possible approaches to carrying identity or session information. The useful question is not “Does this system store data?” but “What context must the server remember between requests to interpret the next one?”',
    ],
    keyPoints: [
      'Stateless means the current request does not depend on remembered conversation context.',
      'Stateless systems can still store durable data in databases and temporary data in caches.',
      'Stateful systems keep session or connection context, which can help workflows but complicates scaling.',
      'Authentication tokens and server-side sessions are different ways to manage identity and session information.',
    ],
  },
  {
    id: 'section-1-2-8',
    order: 8,
    title: 'What Is Multi-tier Architecture?',
    kind: 'concepts',
    paragraphs: [
      'A tier is a logical grouping of responsibilities. Multi-tier architecture separates presentation, application logic and data storage so that a change in one area does not force a change in every other area. It is an organising idea, not a count of machines.',
      'The presentation tier is what the user sees and interacts with: pages, screens and client-side behaviour. The application tier exposes endpoints, applies business rules, validates requests and coordinates work. The data tier stores and retrieves durable information such as products, users and orders.',
      'In an online store, the browser renders a product page, the application tier decides whether that product may be shown and calculates any customer-specific price, and the database holds the catalogue. This separation improves organisation because a developer can locate pricing rules in one place and database details in another. It also allows each area to evolve independently when the contract between them stays stable.',
      'Each additional tier adds a boundary. Boundaries bring network calls, data transfer, deployment coordination and more places to investigate during an incident. Multi-tier architecture is useful when the separation solves a real maintainability or scaling problem, not merely because more boxes look more complete.',
    ],
    keyPoints: [
      'Presentation, application and data tiers group related responsibilities.',
      'Separation makes responsibilities easier to locate, test and change.',
      'Logical tiers do not prescribe physical servers.',
      'More tiers add communication and operational complexity.',
    ],
  },
  {
    id: 'section-1-2-9',
    order: 9,
    title: '2-Tier Architecture',
    kind: 'tradeoffs',
    paragraphs: [
      'In a two-tier design, a client application communicates with a database server. The interface and much of the application logic live in the client tier; the database tier stores data and answers queries. A small internal reporting tool with a single desktop application is a typical example.',
      'The structure can be quick to build and easy to understand for a limited audience. With few clients and simple rules, fewer moving parts mean fewer deployment and communication paths. That makes two-tier architecture a reasonable deliberate choice in the right setting; it is not automatically wrong or obsolete.',
      'The limitations appear when more client types or more sensitive rules are added. Pricing or permission logic placed in one client must be copied into every other client, where it can drift. Direct database access also makes it harder to control what callers may read or change. The client must handle database details, and database connections may scale poorly when many clients stay connected.',
    ],
    tradeoffs: [
      {
        id: 'tradeoff-1-2-two-tier-simplicity',
        choice: 'Keep the client and database as two tiers',
        benefit: 'Few components, a short request path and straightforward local development.',
        cost: 'Shared rules and data access controls are harder to enforce across clients.',
      },
      {
        id: 'tradeoff-1-2-two-tier-use',
        choice: 'Use two tiers for a small internal tool',
        benefit: 'Fast delivery when users, rules and security needs are limited.',
        cost: 'Growth may require moving logic out of the client later.',
      },
      {
        id: 'tradeoff-1-2-two-tier-access',
        choice: 'Allow the client to query the database directly',
        benefit: 'Less intermediate code for simple reads and writes.',
        cost: 'The database becomes the enforcement point and its schema becomes exposed to callers.',
      },
    ],
    keyPoints: [
      'Two tiers mean client application plus database server.',
      'Simplicity is a genuine advantage for small, controlled use cases.',
      'Client-held rules and direct database access become risks as clients and requirements multiply.',
    ],
  },
  {
    id: 'section-1-2-10',
    order: 10,
    title: '3-Tier Architecture',
    kind: 'process',
    paragraphs: [
      'A three-tier design inserts an application tier between the presentation tier and the data tier. Browsers and mobile apps call an API instead of the database. The API applies business rules and controls how the data tier is used.',
      'For a product request, the presentation tier sends GET /api/products/42. The application tier validates the id, checks visibility rules and asks the data tier for the product. The data tier returns the row, the application tier formats a response, and the presentation tier renders it. The same API can serve a mobile app without duplicating those rules.',
      'Compared with two tiers, business logic is centralised, database access is mediated and responsibilities are easier to maintain. Each tier can evolve behind a stable contract: the database schema can change while the API response stays consistent, and a new client can be added without rewriting the rules. The cost is another component to deploy, monitor and call across a network.',
      'Logical tiers are not physical servers. A small deployment can run the API and database on one host, or even in one process during early development, while keeping the logical boundary clear. A larger deployment can run them separately. The architecture describes responsibility, not hardware.',
    ],
    steps: [
      {
        id: 'step-1-2-10-1',
        title: 'Presentation sends a request',
        description: 'The browser calls the product API instead of the database directly.',
      },
      {
        id: 'step-1-2-10-2',
        title: 'Application tier validates',
        description: 'The endpoint checks the product id and the caller’s permission.',
      },
      {
        id: 'step-1-2-10-3',
        title: 'Application tier applies rules',
        description: 'It decides whether the product is visible and which fields may be returned.',
      },
      {
        id: 'step-1-2-10-4',
        title: 'Data tier answers',
        description: 'The database returns the requested row without knowing about HTTP.',
      },
      {
        id: 'step-1-2-10-5',
        title: 'Application tier builds the response',
        description: 'It formats the result and selects a status code.',
      },
      {
        id: 'step-1-2-10-6',
        title: 'Presentation tier renders',
        description: 'The browser displays the product or handles an error outcome.',
      },
    ],
    keyPoints: [
      'The application tier mediates between users and stored data.',
      'Centralised rules and controlled data access improve maintainability and security reasoning.',
      'An extra tier adds a network hop and operational work.',
      'Logical tiers can share physical infrastructure.',
    ],
  },
  {
    id: 'section-1-2-11',
    order: 11,
    title: '2-Tier vs 3-Tier Comparison',
    kind: 'concepts',
    paragraphs: [
      'Neither structure is universally superior. Two tiers reduce the number of components and can be appropriate for a small application with trusted users and simple rules. Three tiers add a boundary where shared rules, access control and independent evolution matter.',
      'The table compares the two structures across the criteria that usually drive the decision. Read each row as a tendency, not a guarantee. A well-structured two-tier application can still validate input carefully, and a poorly structured three-tier application can still scatter rules across clients.',
      'Requirements decide the right choice. Ask how many clients need the same logic, who should be allowed to reach the data, how often rules change and what operational capacity the team has. Add the application tier when those answers show a real need for a shared boundary.',
    ],
    keyPoints: [
      'Two tiers favour simplicity; three tiers favour shared logic and controlled access.',
      'Business logic location and database access are the most important differences.',
      'Choose from requirements and constraints, not from a belief that one pattern is always better.',
    ],
  },
  {
    id: 'section-1-2-12',
    order: 12,
    title: 'Common Mistakes',
    kind: 'mistakes',
    paragraphs: [
      'Client-server mistakes usually come from forgetting that a network boundary and multiple callers exist. Each mistake below states why it happens, why it causes trouble and how to reason more clearly about the design.',
    ],
    commonMistakes: [
      'Putting business logic entirely inside the client. It happens because the client is where the user clicks and where immediate feedback is easy to build. It is problematic when web, mobile and service clients must all reproduce the same price or permission rule, which invites drift. Keep presentation feedback in the client but place shared rules behind a server contract.',
      'Exposing direct database access unnecessarily. It happens because a direct query can look faster than designing an API. It becomes risky when every caller can inspect the schema or bypass rules, and the schema hardens into an external contract. Mediate access through an application tier when callers, sensitivity or rule complexity grow.',
      'Assuming a server always means a physical machine. It happens because diagrams often draw a box labelled server. That hides the difference between software roles and hosting choices, and it can lead to confused deployment conversations. Say server software or service when you mean the program, and name the host or container only when deployment is the topic.',
      'Confusing stateless communication with an application that stores no data. It happens because stateless sounds like no state at all. It is wrong because product databases and caches still hold data, and the misunderstanding leads to poor storage design. Ask whether the server must remember a previous request to interpret the current one.',
      'Assuming every tier must run on a separate physical server. It happens when diagrams are read as deployment instructions. It adds unnecessary cost and complexity to small systems. Treat tiers as logical responsibilities and choose physical placement from load, isolation and operational needs.',
      'Ignoring network failures and latency. It happens because local function calls appear instant and reliable during development. In production, users see spinners, timeouts and confusing errors when the network or server fails. Design explicit timeouts, retry reasoning, status handling and helpful client messages from the start.',
      'Treating the client as trusted. It happens when developers assume the official app is the only caller. An attacker or integration can call the API directly and omit client-side checks. Validate inputs and enforce permissions on the server even when the client also checks them.',
    ],
    keyPoints: [
      'Question any rule that depends on a particular client behaving correctly.',
      'Name responsibilities and boundaries before choosing hosting details.',
      'Design the network failure path as carefully as the success path.',
    ],
  },
  {
    id: 'section-1-2-13',
    order: 13,
    title: 'Key Takeaways',
    kind: 'concepts',
    paragraphs: [
      'A client starts a request and handles the response; a server receives the request, applies logic, accesses data when needed and returns a result. The request-response model gives that exchange a repeatable eight-stage shape.',
      'Stateless and stateful describe how much context must be remembered between requests, not whether a system stores data. Multi-tier architecture separates presentation, application logic and data storage to make responsibilities clearer, while recognising that boundaries add cost.',
      'Two-tier and three-tier designs are tools, not rankings. Choose the structure that matches the number of clients, the location of rules, data access needs and the team’s ability to operate the result.',
    ],
    keyPoints: [
      'Clients initiate requests; servers process them and return responses.',
      'A request carries method, URL, headers and an optional body; a response carries a status code, headers and an optional body.',
      'Stateless requests do not depend on remembered conversation context, but stateless systems still store data.',
      'Presentation, application and data tiers group responsibilities logically, not physically.',
      'Two tiers are simpler; three tiers centralise rules and mediate database access at the cost of another boundary.',
      'Network failures, latency and untrusted clients must be designed for explicitly.',
      'Every architectural choice should be justified by requirements and its trade-offs.',
    ],
  },
  {
    id: 'section-1-3-1',
    order: 1,
    title: 'Introduction: What Happens When You Open a Web Page?',
    kind: 'introduction',
    paragraphs: [
      'Imagine a shopper typing https://shop.example.com/products into a browser and pressing Enter. A moment later a product grid appears. Nothing in that address is a direct wire to a machine, and the page did not appear by magic. A chain of systems worked together: the browser interpreted the address, a naming service found the destination, a connection was established, a secure channel was negotiated, a request was sent, and a response was rendered.',
      'Web fundamentals are the study of that chain. They matter in System Design because every later architectural decision sits on top of it. APIs define the messages exchanged, caches can avoid repeating lookups and fetches, load balancers and reverse proxies sit along the request path, and distributed systems exist because one machine cannot serve every user. You cannot reason about those choices without knowing what a request actually has to traverse.',
      'At its simplest, the web is a request-response exchange: a client asks for a resource and a server answers. The useful question for a designer is not just "does it work?" but "where does time go, where can it fail, and what is protected?" Each stage is both a capability and a potential source of latency or failure.',
      'This lesson uses one product-page scenario throughout so the stages connect into a single story. It stays at a conceptual level: deeper protocol details belong to Domain 2, and HTTP methods and status codes are covered in Module 1.4.',
    ],
    keyPoints: [
      'A URL is a set of instructions, not a direct line to a machine.',
      'The web is a request-response exchange between a client and a server across a network.',
      'Every stage in the journey adds latency and a possible failure point.',
    ],
  },
  {
    id: 'section-1-3-2',
    order: 2,
    title: 'Understanding URLs and Domain Names',
    kind: 'concepts',
    paragraphs: [
      'A URL, or Uniform Resource Locator, tells a browser what resource to request and how to reach it. Consider https://shop.example.com/products?category=lamps#reviews. The scheme, https, tells the browser to use HTTP inside a TLS-protected connection. The domain name, shop.example.com, is the human-readable destination. The port is implicit here: HTTPS defaults to port 443, just as plain HTTP defaults to port 80. A different port would be written after the domain, for example :8443.',
      'The path, /products, identifies the resource on that site. The query string, ?category=lamps, carries extra parameters the server can use to select or filter content; it is not part of the path. The fragment, #reviews, points to a section inside the returned document and is handled by the browser, not sent as part of the HTTP request target.',
      'A domain name is a label people can remember. It is not the server itself and it is not an address a network can route to directly. Networks route using IP addresses. The domain name must be resolved into an IP address before a connection can be made, and that resolution may change over time. Several names can point to one address, and one name can resolve to different addresses in different places or at different moments.',
      'This distinction is a foundation for later design topics: moving traffic between servers, adding a load balancer, or migrating a service can often be done by changing name-to-address mappings rather than asking users to learn a new address.',
    ],
    keyPoints: [
      'A URL combines scheme, domain, optional port, path, query parameters and fragment.',
      'The domain name is a human-readable identifier, not the server and not a routable address.',
      'Resolution maps the name to an IP address, and that mapping can change.',
      'The fragment is a browser-side instruction and is not sent in the HTTP request.',
    ],
  },
  {
    id: 'section-1-3-3',
    order: 3,
    title: 'What Is HTTP?',
    kind: 'concepts',
    paragraphs: [
      'HTTP stands for Hypertext Transfer Protocol. It is an application-layer protocol: a agreed format and set of rules for how a client and a server exchange messages. It does not move the bytes across the network itself; lower layers do that. HTTP defines what a request and a response look like so that different browsers and different servers can understand each other.',
      'The interaction is request-response. The client sends a request describing what it wants. The server processes it and returns a response containing a result status and, usually, content. The client then acts on that response by rendering a page, parsing data or showing an error.',
      'HTTP is stateless. Each request is a self-contained message that carries the information needed to process it; the protocol does not require the server to remember the previous request. This does not mean the application stores no data. Databases, caches and session stores can hold state, and browsers can send cookies, but the protocol itself does not assume a continuing conversation.',
      'This lesson introduces HTTP as a concept and shows the shape of its messages. Methods such as GET and POST, status-code families, headers in depth and version differences are treated in Module 1.4. Here the goal is to recognise where HTTP sits: above the connection and below the application logic.',
    ],
    keyPoints: [
      'HTTP is an application-layer protocol that defines message format and exchange rules.',
      'Communication follows a request-response pattern.',
      'Stateless means requests do not depend on remembered protocol context, not that the application has no storage.',
    ],
  },
  {
    id: 'section-1-3-4',
    order: 4,
    title: 'HTTP Request Structure',
    kind: 'concepts',
    paragraphs: [
      'A request begins with a request line. In GET /products?category=lamps HTTP/1.1, the first token is the method (GET), the second is the request target (/products?category=lamps), and the third is the HTTP version (HTTP/1.1). The method says what the client wants to do, the target identifies the resource, and the version tells the server which message rules apply.',
      'After the request line come headers, each on its own line as a name and value. Host: shop.example.com tells the server which site the request is for, which matters when one server hosts several sites. Accept: text/html says which response format the client prefers. User-Agent identifies the client, and Cookie can carry small pieces of state the server previously asked the browser to store.',
      'An empty line separates the headers from the body. The body is optional. A GET request normally has none because all the information it needs is in the target and headers. A form submission or an API write commonly has a body containing the data being sent, together with a Content-Type header describing how to parse it.',
      'The first code example after this section shows a compact request and response together. Reading the request line first, then the headers, then the body is a reliable habit for understanding any HTTP exchange.',
    ],
    keyPoints: [
      'The request line contains method, request target and HTTP version.',
      'Headers carry routing, format, identity and other metadata.',
      'A blank line separates headers from an optional body.',
    ],
  },
  {
    id: 'section-1-3-5',
    order: 5,
    title: 'HTTP Response Structure',
    kind: 'concepts',
    paragraphs: [
      'A response starts with a status line. In HTTP/1.1 200 OK, the fields are the HTTP version, a numeric status code and a short reason phrase. The code is the important part: it tells the client how the server categorised the result. Reason phrases are human-readable and not a substitute for the number.',
      'Headers follow. Content-Type: text/html; charset=utf-8 tells the browser how to interpret the bytes. Content-Length gives the size. Cache-Control: max-age=60 says the result may be reused for a limited time, which reduces repeated work. Set-Cookie asks the browser to store a small value for later requests.',
      'After another blank line comes the response body: the bytes the client will process, such as HTML for a product page or JSON for an API call. The browser uses the status and headers to decide what to do before it renders the body.',
      'A status code describes the result of handling the request, not necessarily the complete business outcome. A 200 response can still contain a message that an item is out of stock, and a failed lookup might be represented in the body rather than by the status alone. Interpreting status codes precisely is part of Module 1.4; the key idea here is that status, headers and body answer different questions.',
    ],
    keyPoints: [
      'The status line contains the version, status code and reason phrase.',
      'Headers describe the body and how it may be reused.',
      'The status reports how the request was handled, not every business detail.',
    ],
  },
  {
    id: 'section-1-3-6',
    order: 6,
    title: 'HTTP vs HTTPS',
    kind: 'tradeoffs',
    paragraphs: [
      'HTTPS means HTTP over TLS. It is not a different application protocol: the same kinds of requests and responses are exchanged, but they travel inside an encrypted, authenticated connection. The padlock in a browser indicates that this protected channel was established, not that the website is trustworthy in every respect.',
      'TLS provides three benefits. Confidentiality means a passive observer cannot read the messages. Integrity means tampering with messages in transit can be detected. Authentication means the client can verify that it is talking to the party named in a valid certificate, rather than an impostor. Together these protect against eavesdropping, modification and simple impersonation on untrusted networks.',
      'HTTPS does not make an application completely secure. It does not stop a compromised server, a vulnerable application, a phishing site with its own valid certificate, or a user who is tricked into sharing credentials. It also does not hide every property of a connection, such as the destination address and rough traffic patterns. Security still requires correct application logic, authorisation and careful handling of data.',
    ],
    tradeoffs: [
      {
        id: 'tradeoff-1-3-6-1',
        choice: 'Serve the site over HTTPS with TLS',
        benefit: 'Confidentiality, integrity and server authentication protect users on untrusted networks.',
        cost: 'Certificate management and an initial handshake add operational work and some latency, largely reduced by connection reuse.',
      },
      {
        id: 'tradeoff-1-3-6-2',
        choice: 'Serve the site over plain HTTP',
        benefit: 'No certificate or handshake is needed, which can be convenient for a local experiment.',
        cost: 'Requests and responses can be read or modified in transit and the server cannot be authenticated.',
      },
      {
        id: 'tradeoff-1-3-6-3',
        choice: 'Rely on HTTPS alone for application security',
        benefit: 'Transport-level risks such as eavesdropping are reduced.',
        cost: 'Application flaws, broken authorisation and user deception remain fully exploitable.',
      },
    ],
    keyPoints: [
      'HTTPS is HTTP carried inside a TLS-protected connection.',
      'TLS provides confidentiality, integrity and server authentication.',
      'HTTPS reduces transport risks but does not guarantee application security.',
    ],
  },
  {
    id: 'section-1-3-7',
    order: 7,
    title: 'DNS Fundamentals',
    kind: 'concepts',
    paragraphs: [
      'DNS, the Domain Name System, is a distributed directory that maps human-readable names to information such as IP addresses. Humans are good at remembering names; routers move packets using numeric addresses. DNS bridges those two worlds. Without it, every user would need to know and update the address of every site they visit.',
      'A resolver is the component that performs the lookup on behalf of a client. It may already know the answer from cache. If not, it can ask other DNS servers: root servers point to the servers for top-level domains such as .com, TLD servers point to the authoritative servers for a domain such as example.com, and authoritative servers hold the actual records for that zone.',
      'A record is one entry in that directory. Different record types serve different purposes; an address record, for example, maps a name to an IPv4 address. The record returned for a name can change when a service moves or when traffic is directed to different servers, which is what makes DNS useful for operations.',
      'Caching is essential to making DNS fast at global scale. A time to live, or TTL, says how long a resolver may keep an answer before checking again. A longer TTL reduces lookups but delays changes; a shorter TTL allows faster changes but more lookups. This is a design trade-off, not a fixed rule.',
    ],
    keyPoints: [
      'DNS maps names to records such as IP addresses so humans do not need to handle numeric addresses.',
      'Resolvers, root servers, TLD servers and authoritative servers each have a distinct role.',
      'Caching and TTL make DNS fast, at the cost of delayed propagation of changes.',
      'DNS is a lookup service; it does not host the website.',
    ],
  },
  {
    id: 'section-1-3-8',
    order: 8,
    title: 'DNS Resolution Walkthrough',
    kind: 'process',
    paragraphs: [
      'Take the shopper entering https://shop.example.com/products. Before any connection to the store can be made, the browser needs the IP address for shop.example.com. The browser and operating system may already have it, so the lookup can be extremely short. Only a miss starts the fuller sequence below.',
      'The important actors are the browser cache, the operating-system resolver cache, the recursive resolver supplied by the network or a public provider, and the hierarchy of root, TLD and authoritative servers. The recursive resolver does the chasing so the browser does not have to.',
      'Real resolution often skips steps because something along the path already has a cached answer, and a name may be implemented with aliases that require more than one lookup. The model below is the complete conceptual path, useful for reasoning even when an individual lookup is shorter.',
    ],
    steps: [
      {
        id: 'step-1-3-8-1',
        title: 'Browser checks its DNS cache',
        description: 'The browser looks for a recent answer for shop.example.com. A valid cached answer avoids any further lookup.',
      },
      {
        id: 'step-1-3-8-2',
        title: 'Operating system checks its cache',
        description: 'On a miss, the operating-system resolver checks its own cache and local configuration before asking anyone else.',
      },
      {
        id: 'step-1-3-8-3',
        title: 'Recursive resolver is asked',
        description: 'The system asks its configured recursive resolver for the address. The resolver takes responsibility for finding the answer.',
      },
      {
        id: 'step-1-3-8-4',
        title: 'Root server refers to the TLD servers',
        description: 'If the resolver has no cached answer, it asks a root server, which refers it to the servers for the .com top-level domain.',
      },
      {
        id: 'step-1-3-8-5',
        title: 'TLD server refers to the authoritative server',
        description: 'The .com server points the resolver to the authoritative DNS servers for the example.com zone.',
      },
      {
        id: 'step-1-3-8-6',
        title: 'Authoritative server returns the record',
        description: 'The authoritative server answers with the address record for shop.example.com and its TTL.',
      },
      {
        id: 'step-1-3-8-7',
        title: 'Answer is returned and cached',
        description: 'The resolver returns the IP address to the operating system and browser, caching it for the TTL so later requests can skip most steps.',
      },
    ],
    keyPoints: [
      'Caches are checked first, so a full root-to-authoritative lookup is not guaranteed.',
      'The recursive resolver performs the hierarchy walk on behalf of the client.',
      'The returned answer is cached for a bounded time defined by its TTL.',
    ],
  },
  {
    id: 'section-1-3-9',
    order: 9,
    title: 'TCP and the Connection',
    kind: 'process',
    paragraphs: [
      'Traditional HTTP needs a transport that delivers bytes reliably and in order. TCP provides that for HTTP/1.1 and HTTP/2. Before application data is sent, the client and server perform a three-way handshake so both sides agree that a connection exists and can track what has been sent.',
      'A connection is not a physical cable. It is state held by both endpoints: sequence numbers, buffering and rules for retransmission. What it provides is a reliable, ordered stream of bytes. It does not provide HTTP meaning; the client still has to write a valid HTTP request over that stream.',
      'TCP is connection-oriented and reliable. UDP is simpler and does not by itself guarantee delivery or order, which makes it suitable for cases where timeliness matters more than perfect delivery. The distinction is not a ranking: each fits different needs. HTTP/3 uses QUIC over UDP, and QUIC supplies its own reliability and security rather than relying on TCP.',
      'This lesson stops at the high level. Congestion control, packet loss and routing detail belong to Domain 2. What matters here is recognising that connection setup is a step with a cost, and that it is separate from DNS and from HTTP.',
    ],
    steps: [
      {
        id: 'step-1-3-9-1',
        title: 'Client sends SYN',
        description: 'The browser sends a synchronise message to the server address with an initial sequence number.',
      },
      {
        id: 'step-1-3-9-2',
        title: 'Server replies SYN-ACK',
        description: 'The server acknowledges the client message and sends its own synchronise message with its sequence number.',
      },
      {
        id: 'step-1-3-9-3',
        title: 'Client sends ACK',
        description: 'The client acknowledges the server message, completing the three-way handshake.',
      },
      {
        id: 'step-1-3-9-4',
        title: 'Connection is established',
        description: 'Both sides now have a reliable byte stream ready to carry the TLS negotiation and then the HTTP request.',
      },
    ],
    keyPoints: [
      'TCP gives a reliable, ordered byte stream for HTTP/1.1 and HTTP/2.',
      'SYN, SYN-ACK and ACK establish the connection before application data flows.',
      'HTTP/3 uses QUIC over UDP instead of TCP.',
    ],
  },
  {
    id: 'section-1-3-10',
    order: 10,
    title: 'TLS and the TLS Handshake',
    kind: 'process',
    paragraphs: [
      'TLS exists because the path between a browser and a server crosses networks the parties do not control. Without protection, messages could be read or altered in transit, and a client could be fooled into contacting the wrong party. TLS creates a protected channel in which HTTP messages are carried.',
      'The server presents a certificate that binds its identity to a public key. The browser checks that the certificate is valid, matches the name it is trying to reach and chains to a trusted authority. The parties then establish shared secret keys, which are used to encrypt and verify the messages that follow. Modern TLS uses efficient key establishment and fast symmetric encryption for the bulk of the traffic.',
      'A high-level handshake is enough for this lesson. The client announces what it supports, the server chooses parameters and presents its certificate, the client validates it and participates in key establishment, and both sides confirm they derived the same keys before HTTP is sent. The exact messages and number of round trips depend on the TLS version and configuration; TLS 1.3 is shorter than older versions, so memorising one fixed sequence would be misleading.',
      'HTTPS is simply HTTP inside that protected channel. TLS protects messages while they travel, not the endpoints themselves: it cannot make a compromised server honest or prevent application-level mistakes.',
    ],
    steps: [
      {
        id: 'step-1-3-10-1',
        title: 'Client hello',
        description: 'The browser opens the protected negotiation by stating supported TLS versions and cryptographic options.',
      },
      {
        id: 'step-1-3-10-2',
        title: 'Server hello and certificate',
        description: 'The server chooses parameters, presents its certificate and takes part in the key exchange.',
      },
      {
        id: 'step-1-3-10-3',
        title: 'Client validates and derives keys',
        description: 'The browser checks the certificate and name, then participates in establishing shared secret keys.',
      },
      {
        id: 'step-1-3-10-4',
        title: 'Protected channel is ready',
        description: 'Both sides confirm the keys and begin exchanging encrypted, integrity-checked HTTP messages.',
      },
    ],
    keyPoints: [
      'TLS provides a protected channel for HTTP, which is what HTTPS means.',
      'Certificates support server authentication; key establishment enables encryption.',
      'Handshake details vary by TLS version and configuration.',
    ],
  },
  {
    id: 'section-1-3-11',
    order: 11,
    title: 'The Complete Browser-to-Server Journey',
    kind: 'process',
    paragraphs: [
      'Now combine everything into the product-page scenario. The shopper enters https://shop.example.com/products and presses Enter. The list below is a simplified conceptual sequence: it shows the logical order of operations, which is exactly what a designer needs when reasoning about latency and failure.',
      'Real browsers complicate the picture in helpful ways. They cache DNS answers, reuse existing connections, open several connections or multiplex requests, prefetch resources and fetch page assets in parallel. A subsequent navigation may skip several stages. The model remains useful because those optimisations are attempts to avoid repeating expensive steps in this same journey.',
      'The server side is equally important: after receiving the request, application logic validates it, applies rules, may read a cache or database, and constructs a response. From the browser perspective the journey ends when it has the response and renders it, possibly triggering more requests for images, scripts and styles.',
    ],
    steps: [
      {
        id: 'step-1-3-11-1',
        title: 'User enters the URL',
        description: 'The shopper types https://shop.example.com/products and the browser begins navigation.',
      },
      {
        id: 'step-1-3-11-2',
        title: 'Browser parses the URL',
        description: 'It identifies HTTPS, the domain shop.example.com, the default port 443 and the path /products.',
      },
      {
        id: 'step-1-3-11-3',
        title: 'Browser checks relevant caches',
        description: 'Cached DNS answers and reusable connections can remove whole stages from the journey.',
      },
      {
        id: 'step-1-3-11-4',
        title: 'DNS resolution obtains the IP address',
        description: 'If needed, the resolver hierarchy returns the address for shop.example.com.',
      },
      {
        id: 'step-1-3-11-5',
        title: 'A transport connection is established when required',
        description: 'When no reusable connection exists, TCP uses its handshake, or QUIC establishes a connection for HTTP/3.',
      },
      {
        id: 'step-1-3-11-6',
        title: 'TLS negotiation occurs for HTTPS',
        description: 'The browser validates the server certificate and establishes encrypted session keys.',
      },
      {
        id: 'step-1-3-11-7',
        title: 'Browser sends the HTTP request',
        description: 'A GET request for /products with Host and other headers travels through the protected channel.',
      },
      {
        id: 'step-1-3-11-8',
        title: 'Server processes the request',
        description: 'The server validates the request, applies rules and reads data from a cache or database as needed.',
      },
      {
        id: 'step-1-3-11-9',
        title: 'Server returns an HTTP response',
        description: 'A status line, headers and a body carry the product page or an error back through the connection.',
      },
      {
        id: 'step-1-3-11-10',
        title: 'Browser processes and renders the response',
        description: 'The browser renders the page and may issue further requests for assets shown on it.',
      },
    ],
    keyPoints: [
      'The sequence is conceptual; real browsers cache, reuse connections and fetch in parallel.',
      'DNS, transport, TLS and HTTP are separate stages with separate concerns.',
      'The response often triggers additional requests for page assets.',
    ],
  },
  {
    id: 'section-1-3-12',
    order: 12,
    title: 'Performance and Security Implications',
    kind: 'tradeoffs',
    paragraphs: [
      'Each stage can add a network round trip, and round trips are often the dominant cost on high-latency links. A DNS cache miss can mean several queries. A new TCP connection needs a handshake, and TLS negotiation adds more work before the first HTTP byte can be sent. Users notice the total, so a design that ignores these steps will feel slow even when the application logic is fast.',
      'The usual responses are to avoid the work or to overlap it. Reusing an existing connection avoids repeated transport and TLS setup. Caching DNS answers removes lookup latency. Caching HTTP responses can avoid a request entirely. These techniques introduce freshness concerns, so they must be configured deliberately rather than applied everywhere without thought.',
      'On the security side, HTTPS protects the messages in transit and authenticates the server, which matters on shared or hostile networks. It is one layer in a defence strategy, not the whole strategy. Application authorisation, input validation and secure handling of secrets are still required, and they are covered elsewhere in the curriculum.',
      'This is a foundation, not the full performance lesson. Module 1.5 examines measurement and optimisation in detail; Domain 2 examines the network mechanics. Here the goal is to connect each early stage to a later design decision.',
    ],
    tradeoffs: [
      {
        id: 'tradeoff-1-3-12-1',
        choice: 'Cache DNS answers for their TTL',
        benefit: 'Removes repeated lookups and lowers latency for returning visitors.',
        cost: 'Address changes take time to reach clients that hold cached answers.',
      },
      {
        id: 'tradeoff-1-3-12-2',
        choice: 'Reuse an existing connection',
        benefit: 'Avoids repeated transport and TLS handshakes before sending HTTP.',
        cost: 'Requires connection management and careful handling of idle or failed connections.',
      },
      {
        id: 'tradeoff-1-3-12-3',
        choice: 'Cache HTTP responses',
        benefit: 'Can serve repeat requests without contacting the application at all.',
        cost: 'Stale content becomes possible if caching rules do not match how data changes.',
      },
      {
        id: 'tradeoff-1-3-12-4',
        choice: 'Require HTTPS for every request',
        benefit: 'Protects confidentiality and integrity and authenticates the server.',
        cost: 'Adds certificate operations and handshake work, which can be reduced with reuse and modern TLS.',
      },
    ],
    keyPoints: [
      'DNS, transport and TLS setup can each add round trips before HTTP begins.',
      'Connection reuse and caching remove repeated work but add management concerns.',
      'HTTPS protects the channel; application security remains a separate responsibility.',
    ],
  },
  {
    id: 'section-1-3-13',
    order: 13,
    title: 'Common Mistakes and Misconceptions',
    kind: 'mistakes',
    paragraphs: [
      'These mistakes are common because the browser hides most of the journey. Correcting them produces a more useful mental model for design discussions, incident reviews and interviews.',
    ],
    commonMistakes: [
      'Incorrect assumption: DNS hosts the website. Why it is wrong: DNS only answers name-to-record questions and never serves the page content. Correct model: DNS is a directory lookup; a separate server, often reached at the address DNS returns, serves the site.',
      'Incorrect assumption: a domain name is the same thing as an IP address. Why it is wrong: the name is a human-readable label while the address is what the network routes to, and the mapping can change. Correct model: resolve the name to an address first, then connect to that address.',
      'Incorrect assumption: HTTPS and HTTP are completely different application protocols. Why it is wrong: the request and response structure is HTTP in both cases. Correct model: HTTPS is HTTP carried inside a TLS-protected connection.',
      'Incorrect assumption: HTTPS guarantees that an application is secure. Why it is wrong: it protects the channel but not application logic, authorisation or user decisions. Correct model: treat transport security as one layer and keep application-level safeguards.',
      'Incorrect assumption: DNS always performs a full root-to-authoritative lookup. Why it is wrong: caches at the browser, operating system and resolver can answer immediately. Correct model: a full lookup is the fallback path, not the typical one.',
      'Incorrect assumption: TCP and HTTP are the same thing. Why it is wrong: TCP provides a reliable byte stream while HTTP defines messages carried on it. Correct model: separate transport from application protocol, and remember that HTTP/3 uses QUIC over UDP instead.',
      'Incorrect assumption: TLS encrypts every aspect of the entire network. Why it is wrong: it protects the contents of this connection, while addresses, timing and the endpoints themselves remain visible or trusted outside that protection. Correct model: reason about what the protected channel covers and what it does not.',
      'Incorrect assumption: every browser request creates a brand-new TCP connection. Why it is wrong: browsers reuse connections and modern protocols can multiplex requests over them. Correct model: connection setup is often amortised across many requests.',
    ],
    keyPoints: [
      'DNS resolves names; it does not host content.',
      'HTTPS is transport protection around HTTP, not a different application protocol and not full application security.',
      'Connection setup and DNS lookups are frequently skipped through caching and reuse.',
    ],
  },
  {
    id: 'section-1-3-14',
    order: 14,
    title: 'Key Takeaways',
    kind: 'concepts',
    paragraphs: [
      'Opening a product page is a chain of cooperating steps. The browser interprets a URL, resolves a name to an address, establishes a transport connection when needed, negotiates TLS for HTTPS, sends an HTTP request, and receives an HTTP response that it processes and renders. Each step solves a different problem and can be optimised or can fail independently.',
      'The mental model to carry into later modules is: URL → DNS → IP Address → Transport Connection → TLS → HTTP Request → Server → HTTP Response. When a system is slow or unreachable, locate the stage first; when a design decision is proposed, name the stage it changes and the trade-off it introduces.',
      'This foundation supports the rest of the course. APIs are the contracts carried by HTTP requests, caching can remove lookups and fetches, load balancers and reverse proxies sit on the path, and distributed systems exist because the journey must work reliably at scale.',
    ],
    keyPoints: [
      'URL → DNS → IP Address → Transport Connection → TLS → HTTP Request → Server → HTTP Response.',
      'DNS, transport, TLS and HTTP solve separate problems and fail separately.',
      'Caching and connection reuse remove work but introduce freshness and management concerns.',
      'HTTPS protects messages in transit; application security is a separate responsibility.',
      'Diagnose and design by naming the stage involved.',
    ],
  },
]

export const codeExamples: CodeExample[] = [
  {
    id: 'code-1-1-http-request-response',
    title: 'One HTTP request and response',
    language: 'text',
    code: [
      'GET /products/42 HTTP/1.1',
      'Host: store.example.com',
      'Accept: application/json',
      '',
      'HTTP/1.1 200 OK',
      'Content-Type: application/json',
      'Cache-Control: max-age=60',
      '',
      '{',
      '  "id": 42,',
      '  "name": "Desk lamp",',
      '  "price": 39.00',
      '}',
    ].join('\n'),
    explanation:
      'The first lines are the client request: the method and path name the resource, Host routes it to the store, and Accept asks for JSON. The remaining lines are the server response: 200 OK reports success, Cache-Control says the result may be reused briefly, and the body carries the product data the browser will display.',
  },
  {
    id: 'code-1-1-api-endpoint',
    title: 'A product endpoint with a conditional cache path',
    language: 'text',
    code: [
      '// Illustrative C#-style pseudocode, not tied to one framework.',
      'app.MapGet("/products/{id:int}", async (int id, ProductStore store, Cache cache) =>',
      '{',
      '    var cached = cache.TryGet(id);',
      '    if (cached is not null) return Results.Ok(cached);',
      '',
      '    var product = await store.GetByIdAsync(id);',
      '    if (product is null) return Results.NotFound();',
      '',
      '    cache.Set(id, product, TimeSpan.FromMinutes(1));',
      '    return Results.Ok(product);',
      '});',
    ].join('\n'),
    explanation:
      'This endpoint is the server side of the API contract. It checks the cache first and returns immediately on a hit. On a miss it reads the durable store, stores a temporary copy and returns the product; the one-minute lifetime is a trade-off between faster reads and the chance of serving slightly stale data.',
  },
  {
    id: 'code-1-2-http-get-request',
    title: 'An HTTP GET request and its response',
    language: 'text',
    code: [
      'GET /api/products/42 HTTP/1.1',
      'Host: store.example.com',
      'Accept: application/json',
      'Authorization: Bearer demo-token',
      '',
      'HTTP/1.1 200 OK',
      'Content-Type: application/json',
      'Cache-Control: max-age=60',
      '',
      '{',
      '  "id": 42,',
      '  "name": "Desk lamp",',
      '  "price": 39.00',
      '}',
    ].join('\n'),
    explanation:
      'GET is the method, /api/products/42 is the URL that identifies one product, and the header lines add routing, format and identity information. The expected response starts with 200 OK, declares JSON and carries the product body. The client uses the status to decide that the request succeeded before it displays the data.',
  },
  {
    id: 'code-1-2-csharp-api-endpoint',
    title: 'A C# / ASP.NET Core product endpoint',
    language: 'text',
    code: [
      '// Illustrative ASP.NET Core minimal API endpoint.',
      'app.MapGet("/api/products/{id:int}", async (int id, ProductDb db) =>',
      '{',
      '    var product = await db.Products.FindAsync(id);',
      '    if (product is null) return Results.NotFound();',
      '',
      '    return Results.Ok(new',
      '    {',
      '        product.Id,',
      '        product.Name,',
      '        product.Price',
      '    });',
      '});',
    ].join('\n'),
    explanation:
      'This endpoint is the server side of the exchange. The framework matches the GET route and passes the product id; the handler reads durable data through ProductDb, returns 404 when nothing is found and otherwise returns a 200 response with a small JSON-shaped object. Notice that the client never queries the database directly: the server owns validation, data access and the response contract.',
  },
  {
    id: 'code-1-2-fetch-client-request',
    title: 'Calling the API with JavaScript fetch',
    language: 'javascript',
    code: [
      'async function loadProduct(id) {',
      '  const response = await fetch(`/api/products/${id}`, {',
      '    headers: { Accept: "application/json" },',
      '  });',
      '',
      '  if (!response.ok) {',
      '    throw new Error(`Product request failed: ${response.status}`);',
      '  }',
      '',
      '  return response.json();',
      '}',
    ].join('\n'),
    explanation:
      'fetch sends the GET request and await pauses until a response arrives. response.ok checks whether the status represents success before the body is read, so an error can be raised for a 404 or 500 instead of being displayed as product data. response.json() parses the JSON body for the caller; a real client would then render it or show a clear error.',
  },
  {
    id: 'code-1-3-raw-http',
    title: 'A raw HTTP request and response for the product page',
    language: 'text',
    code: [
      'GET /products?category=lamps HTTP/1.1',
      'Host: shop.example.com',
      'Accept: text/html',
      'User-Agent: Mozilla/5.0',
      '',
      'HTTP/1.1 200 OK',
      'Content-Type: text/html; charset=utf-8',
      'Cache-Control: max-age=60',
      '',
      '<!doctype html><html>...</html>',
    ].join('\n'),
    explanation:
      'The first block is the request: GET is the method, /products?category=lamps is the request target, HTTP/1.1 is the version, and the headers identify the host, the preferred format and the client. The second block is the response: 200 OK is the status line, Content-Type describes the HTML body, and Cache-Control allows brief reuse. The blank lines mark where headers end and the body begins.',
  },
  {
    id: 'code-1-3-fetch-request',
    title: 'A browser fetch for product data',
    language: 'javascript',
    code: [
      'async function loadProducts(category) {',
      '  const response = await fetch(',
      '    `https://shop.example.com/api/products?category=${category}`,',
      '    { headers: { Accept: "application/json" } },',
      '  )',
      '  if (!response.ok) throw new Error(`Request failed: ${response.status}`)',
      '  return response.json()',
      '}',
    ].join('\n'),
    explanation:
      'fetch sends an HTTP request and await waits for the response. response.ok checks the status before the body is parsed, and response.json() reads the JSON payload. The code does not perform DNS, TCP or TLS itself: the browser and underlying platform handle those stages before any HTTP bytes are sent over the protected connection.',
  },
  {
    id: 'code-1-3-aspnet-endpoint',
    title: 'An ASP.NET Core endpoint receiving the request',
    language: 'text',
    code: [
      '// Illustrative ASP.NET Core minimal API endpoint.',
      'app.MapGet("/api/products", async (string? category, ProductDb db) =>',
      '{',
      '    var query = db.Products.AsQueryable();',
      '    if (category is not null) query = query.Where(p => p.Category == category);',
      '    var products = await query.AsNoTracking().ToListAsync();',
      '    return Results.Ok(products);',
      '});',
    ].join('\n'),
    explanation:
      'The framework matches the GET method and /api/products path, then binds the category query parameter. The handler filters durable product data and returns Results.Ok, which produces a 200 response with a JSON body. DNS, transport and TLS have already happened before this code runs; the endpoint only sees the decoded HTTP request.',
  },
]

export const comparisons: Comparison[] = [
  {
    id: 'comparison-1-1-functional-vs-nonfunctional',
    title: 'Functional vs non-functional requirements',
    summary:
      'Functional requirements describe capabilities; non-functional requirements describe measurable qualities. Both must be explicit before a design can be judged.',
    columns: [{ id: 'category', label: 'Category' }],
    rows: [
      {
        id: 'row-create-account',
        criterion: 'User can create an account',
        values: { category: 'Functional' },
      },
      {
        id: 'row-api-latency',
        criterion: 'API responds within 200 ms under a specified workload',
        values: { category: 'Non-Functional' },
      },
      {
        id: 'row-place-order',
        criterion: 'User can place an order',
        values: { category: 'Functional' },
      },
      {
        id: 'row-concurrent-users',
        criterion: 'System supports 10,000 concurrent users',
        values: { category: 'Non-Functional' },
      },
      {
        id: 'row-search-products',
        criterion: 'User can search for products',
        values: { category: 'Functional' },
      },
      {
        id: 'row-service-level',
        criterion: 'System remains available at a defined service level',
        values: { category: 'Non-Functional' },
      },
    ],
  },
  {
    id: 'comparison-1-2-stateless-vs-stateful',
    title: 'Stateless vs stateful communication',
    summary:
      'The distinction concerns whether a request depends on interaction context remembered by the server. It does not describe whether the wider application stores data.',
    columns: [
      { id: 'stateless', label: 'Stateless' },
      { id: 'stateful', label: 'Stateful' },
    ],
    rows: [
      {
        id: 'row-context-1-2',
        criterion: 'Server context between requests',
        values: {
          stateless: 'The current request does not need remembered conversation context.',
          stateful: 'The server keeps session or connection context across interactions.',
        },
      },
      {
        id: 'row-request-contents-1-2',
        criterion: 'Request contents',
        values: {
          stateless: 'The request carries the id and identity information needed to process it.',
          stateful: 'The request may rely on a session identifier or an existing connection.',
        },
      },
      {
        id: 'row-scaling-1-2',
        criterion: 'Scaling behaviour',
        values: {
          stateless: 'Any suitable instance can handle the next request in suitable architectures.',
          stateful: 'State must be shared or the next request must reach an instance that holds it.',
        },
      },
      {
        id: 'row-storage-1-2',
        criterion: 'Data storage',
        values: {
          stateless: 'Databases and caches can still store data; statelessness is about request context.',
          stateful: 'Session or workflow state is stored in memory, a session store or a persistent store.',
        },
      },
      {
        id: 'row-examples-1-2',
        criterion: 'Typical examples',
        values: {
          stateless: 'A REST-style product API call using a token with each request.',
          stateful: 'A login session, a long-lived connection or a multi-step checkout workflow.',
        },
      },
      {
        id: 'row-tradeoff-1-2',
        criterion: 'Main trade-off',
        values: {
          stateless: 'Simpler scaling, but each request must carry enough information.',
          stateful: 'Convenient for sequences of steps, but state management adds coordination.',
        },
      },
    ],
  },
  {
    id: 'comparison-1-2-two-tier-vs-three-tier',
    title: '2-tier vs 3-tier architecture',
    summary:
      'Both structures can be correct. Two tiers reduce components; three tiers add a boundary for shared rules, controlled data access and independent evolution.',
    columns: [
      { id: 'two-tier', label: '2-Tier' },
      { id: 'three-tier', label: '3-Tier' },
    ],
    rows: [
      {
        id: 'row-architecture-1-2',
        criterion: 'Architecture',
        values: {
          'two-tier': 'Client application communicates directly with a database server.',
          'three-tier': 'Presentation tier calls an application tier, which calls the data tier.',
        },
      },
      {
        id: 'row-responsibility-1-2',
        criterion: 'Responsibility distribution',
        values: {
          'two-tier': 'Interface and much logic live in the client; the database stores data.',
          'three-tier': 'Interface, business rules and durable storage are separated into distinct logical tiers.',
        },
      },
      {
        id: 'row-logic-1-2',
        criterion: 'Business logic location',
        values: {
          'two-tier': 'Often distributed into each client, which can cause duplicated or drifting rules.',
          'three-tier': 'Centralised in the application tier and exposed through an API contract.',
        },
      },
      {
        id: 'row-access-1-2',
        criterion: 'Database access',
        values: {
          'two-tier': 'Clients may query the database directly, exposing schema and connection concerns.',
          'three-tier': 'The application tier mediates access and enforces which operations are allowed.',
        },
      },
      {
        id: 'row-maintainability-1-2',
        criterion: 'Maintainability',
        values: {
          'two-tier': 'Simple to change at first; changes multiply when several clients must match.',
          'three-tier': 'Easier to locate and change rules when contracts stay stable.',
        },
      },
      {
        id: 'row-security-1-2',
        criterion: 'Security considerations',
        values: {
          'two-tier': 'Direct access makes it harder to constrain every caller and validate on the server.',
          'three-tier': 'The API can validate input and authorise operations before data access.',
        },
      },
      {
        id: 'row-complexity-1-2',
        criterion: 'Complexity',
        values: {
          'two-tier': 'Fewer components and network hops, with fewer deployment pieces.',
          'three-tier': 'Another component, contract and network boundary to operate and monitor.',
        },
      },
      {
        id: 'row-use-cases-1-2',
        criterion: 'Typical use cases',
        values: {
          'two-tier': 'Small internal tools with few clients, simple rules and limited exposure.',
          'three-tier': 'Products with multiple clients, shared rules, sensitive data or frequent change.',
        },
      },
    ],
  },
  {
    id: 'comparison-1-3-http-vs-https',
    title: 'HTTP vs HTTPS',
    summary:
      'HTTPS is HTTP carried over a TLS-protected connection. The application messages are the same; what changes is the confidentiality, integrity and authentication of their journey.',
    columns: [
      { id: 'http', label: 'HTTP' },
      { id: 'https', label: 'HTTPS' },
    ],
    rows: [
      {
        id: 'row-http-meaning-1-3',
        criterion: 'Meaning',
        values: {
          http: 'Hypertext Transfer Protocol: the application-layer request-response protocol itself.',
          https: 'HTTP messages exchanged inside a TLS-protected connection; not a separate application protocol.',
        },
      },
      {
        id: 'row-http-encryption-1-3',
        criterion: 'Encryption',
        values: {
          http: 'Messages travel as readable text, so anyone on the path can inspect them.',
          https: 'Messages are encrypted with keys established during the TLS handshake.',
        },
      },
      {
        id: 'row-http-authentication-1-3',
        criterion: 'Authentication',
        values: {
          http: 'The client has no certificate-based way to verify which server answered.',
          https: 'The server presents a certificate that the client validates against trusted authorities and the requested name.',
        },
      },
      {
        id: 'row-http-integrity-1-3',
        criterion: 'Integrity',
        values: {
          http: 'Content can be modified in transit without the client detecting it.',
          https: 'Tampering with protected messages can be detected.',
        },
      },
      {
        id: 'row-http-usage-1-3',
        criterion: 'Typical usage',
        values: {
          http: 'Local experiments or internal cases where the network is fully trusted.',
          https: 'Public websites, APIs and any interaction carrying personal or sensitive data.',
        },
      },
      {
        id: 'row-http-implications-1-3',
        criterion: 'Security implications',
        values: {
          http: 'Exposed to eavesdropping, modification and impersonation on untrusted networks.',
          https: 'Reduces transport risks but does not fix application flaws, broken authorisation or user deception.',
        },
      },
      {
        id: 'row-http-performance-1-3',
        criterion: 'Performance implication',
        values: {
          http: 'No TLS negotiation is needed, so the first request can be sent sooner.',
          https: 'Handshake work adds latency on a new connection, largely offset by reuse and modern TLS.',
        },
      },
    ],
  },
  {
    id: 'comparison-1-3-domain-vs-ip',
    title: 'Domain name vs IP address',
    summary:
      'A domain name is a memorable label; an IP address is the numeric locator networks use. DNS connects the two, and the mapping can change without users learning anything new.',
    columns: [
      { id: 'domain', label: 'Domain name' },
      { id: 'ip', label: 'IP address' },
    ],
    rows: [
      {
        id: 'row-domain-meaning-1-3',
        criterion: 'Meaning',
        values: {
          domain: 'A human-readable name such as shop.example.com that identifies a service or host.',
          ip: 'A numeric address such as 203.0.113.10 that identifies a network interface location.',
        },
      },
      {
        id: 'row-domain-purpose-1-3',
        criterion: 'Purpose',
        values: {
          domain: 'Gives people a stable, meaningful way to refer to a destination.',
          ip: 'Lets network equipment route packets toward that destination.',
        },
      },
      {
        id: 'row-domain-readability-1-3',
        criterion: 'Human readability',
        values: {
          domain: 'Easy to remember and communicate; can reflect an organisation or brand.',
          ip: 'Difficult to remember and not meaningful to most users.',
        },
      },
      {
        id: 'row-domain-routing-1-3',
        criterion: 'Network routing role',
        values: {
          domain: 'Not used directly for routing; it must be resolved first.',
          ip: 'Used by routing decisions to deliver packets across networks.',
        },
      },
      {
        id: 'row-domain-relationship-1-3',
        criterion: 'Relationship between them',
        values: {
          domain: 'DNS maps this name to one or more records, and the mapping may change over time.',
          ip: 'The returned answer is what the browser connects to, cached only for the record TTL.',
        },
      },
      {
        id: 'row-domain-operations-1-3',
        criterion: 'Operational implication',
        values: {
          domain: 'Changing the mapping can move traffic between servers without changing what users type.',
          ip: 'Addresses tied to machines make migrations and load distribution harder to hide from users.',
        },
      },
    ],
  },
]

export const practicalChallenges: PracticalChallenge[] = [
  {
    id: 'challenge-1-1',
    title: 'Challenge: Design a Simple Online Store',
    scenario:
      'You are building an online store. The first version supports browsing products, user registration, adding products to a basket and placing orders. No architecture has been chosen yet.',
    requirements: [
      'Identify the functional requirements for the initial version.',
      'Write at least three non-functional requirements with measurable targets where reasonable.',
      'Name the main system components and state one responsibility for each.',
      'Describe how components communicate when a user browses products and when a user places an order.',
      'Identify one likely bottleneck as usage grows and explain how you would detect it.',
    ],
    constraints: [
      'No implementation code.',
      'Do not add a cache, load balancer or queue unless you can justify it.',
      'Keep the first sketch small enough to explain in a few minutes.',
    ],
    deliverables: [
      'A short design brief with requirements, components, two request flows and one bottleneck note.',
      'A one-paragraph explanation of one trade-off in your design.',
    ],
    hints: [
      'Start with actors and actions before drawing boxes.',
      'A cache reduces repeated reads but introduces the possibility of stale data.',
      'A bottleneck is a component that limits overall throughput; ask which component receives the most requests or holds the most data.',
      'There is no single correct answer. The quality of your reasoning matters more than the number of boxes.',
    ],
  },
  {
    id: 'challenge-1-2',
    title: 'Challenge: Design a Client-Server Product Catalog',
    scenario:
      'A company wants a product catalog application. Users should browse a list of products and open product details. Products are stored in a database, and several client types must use the same backend behaviour and data. No architecture has been chosen yet.',
    requirements: [
      'Identify the clients that might use the catalog.',
      'Identify the server responsibilities needed to support browsing and product details.',
      'Define the request-response flow for loading the product list and one product detail page.',
      'Identify the data tier and state what it should and should not be responsible for.',
      'Decide whether a 2-tier or 3-tier structure is more appropriate and justify the choice.',
      'Explain how the client should behave when the network fails or the server cannot be reached.',
      'Explain which responsibilities should remain on the server even when the client could perform them.',
    ],
    constraints: [
      'No implementation code.',
      'Do not assume that every logical tier needs a separate physical server.',
      'Do not treat the client as trusted.',
      'Give a reason for each component you include.',
    ],
    deliverables: [
      'A short architecture sketch that names the clients, server responsibilities, request paths and data tier.',
      'A short decision note comparing 2-tier and 3-tier options and explaining which you choose.',
      'A short failure note describing at least two outcomes the client must handle.',
    ],
    hints: [
      'A client is a role, so a mobile app and another backend service can both be clients.',
      'Ask which rules must be identical for every client; those usually belong on the server.',
      'The data tier stores and returns data; business rules about visibility belong above it.',
      'Direct database access may be acceptable for a small internal tool, but ask who can reach it and who enforces rules.',
      'There is no full solution here: a defensible answer states requirements, trade-offs and failure behaviour.',
    ],
  },
  {
    id: 'challenge-1-3',
    title: 'Challenge: Follow a Store Product Page Request',
    scenario:
      'A shopper opens an online store by entering https://shop.example.com/products?category=lamps in the address bar and pressing Enter. The product grid appears a moment later. You have been asked to explain what happened between the keypress and the rendered page to a new engineer who thinks "the browser asks Google for the IP and then downloads the page."',
    requirements: [
      'Break the URL into scheme, domain, path, query parameters and implicit port, and say what each contributes.',
      'Describe the DNS resolution that turns shop.example.com into an IP address, naming caching, the recursive resolver and the hierarchy of root, TLD and authoritative servers.',
      'Explain how a transport connection is established when required, including the SYN, SYN-ACK and ACK exchange and what the connection provides.',
      'Explain what TLS adds for HTTPS, including the certificate check and key establishment, without relying on version-specific handshake steps.',
      'Show the shape of the HTTP request the browser sends and the response the server returns, naming their main parts.',
      'Explain one performance question: which stages can add round trips, and how caching or connection reuse could reduce them.',
      'Explain one security question: what HTTPS protects and one thing it does not protect.',
      'Identify at least two misconceptions in the new engineer’s statement and correct them.',
    ],
    constraints: [
      'No implementation code.',
      'Stay at the conceptual level of this lesson; do not expand into detailed networking protocol rules.',
      'Use the same product-page scenario throughout rather than switching examples.',
      'State that the sequence is simplified and that real browsers may reuse connections or fetch assets in parallel.',
    ],
    deliverables: [
      'An ordered explanation of the journey from URL entry to rendered response, with each stage named.',
      'A short performance note naming at least two stages that can add latency and one way to reduce it.',
      'A short security note describing one HTTPS benefit and one remaining application-level risk.',
      'A brief correction of at least two misconceptions with an accurate mental model.',
    ],
    hints: [
      'Start by separating what the browser knows from what it has to discover.',
      'Ask whether a cached answer or reusable connection could remove a stage entirely.',
      'DNS resolves names; the server that serves the page is contacted after resolution.',
      'TLS protects messages in transit, not the correctness of the application running on the server.',
      'There is no single perfect wording: clear reasoning and correct stage ordering matter more than memorised phrases.',
    ],
  },
]

export const lessonSummaries: LessonSummary[] = [
  {
    id: 'summary-1-1',
    overview:
      'System design is the practice of shaping components, communication and data flow to satisfy requirements and constraints. Requirement-first thinking keeps a design small, explainable and adaptable.',
    keyTakeaways: [
      'System design decides how the complete application is structured; coding implements features inside that structure.',
      'The main building blocks are clients, servers, APIs, databases, caches, load balancers and message queues; several are optional.',
      'Functional requirements say what the system does; non-functional requirements say how well it does it.',
      'Scalability, availability, reliability and performance are distinct qualities that must be stated explicitly.',
      'Every architectural choice has a gain and a cost; state the trade-off instead of hiding it.',
      'Start with requirements and constraints, then components and data flow; choose technology last.',
    ],
    nextSteps: [
      'Apply the ten-step workflow to the practical challenge before moving on.',
      'Open the linked simulation to watch the client–server request path described in this lesson.',
    ],
  },
  {
    id: 'summary-1-2',
    overview:
      'Client-server architecture assigns requests to clients and responses to servers. Multi-tier designs extend that separation to presentation, application logic and data storage, with benefits and costs that must be evaluated against requirements.',
    keyTakeaways: [
      'A client initiates requests and handles responses; a server processes requests, applies rules, accesses data and returns results.',
      'The request-response cycle links a user action, request preparation, network transfer, server processing, response creation and client display.',
      'A request has a method, URL, headers and optional body; a response has a status code, headers and optional body.',
      'Stateless communication does not depend on remembered conversation context, but the application can still store data in databases and caches.',
      'Stateful communication keeps session or connection context, which can help workflows but adds scaling and coordination concerns.',
      'Multi-tier architecture separates presentation, application and data responsibilities logically, not necessarily across separate machines.',
      'Two tiers are simpler; three tiers centralise business rules, mediate database access and improve maintainability at the cost of another boundary.',
      'Network failures, latency and untrusted clients must be handled explicitly in a client-server design.',
    ],
    nextSteps: [
      'Complete the product page challenge and explain the journey aloud without looking at the lesson.',
      'Use the URL → DNS → IP Address → Transport Connection → TLS → HTTP Request → Server → HTTP Response model when you meet APIs, caching and load balancing in later modules.',
    ],
  },
  {
    id: 'summary-1-3',
    overview:
      'A web request is a chain of separate stages: the browser interprets a URL, DNS resolves a name to an IP address, a transport connection is established when needed, TLS protects HTTPS traffic, and HTTP carries the request and response. Recognising the stages makes latency, failure and security easier to reason about.',
    keyTakeaways: [
      'A URL describes scheme, domain, optional port, path, query parameters and fragment; the domain is a name, not the server.',
      'DNS maps names to addresses through caches, a recursive resolver and the root, TLD and authoritative hierarchy.',
      'DNS answers are cached for a TTL, so a full lookup is not always necessary.',
      'TCP provides a reliable ordered byte stream via SYN, SYN-ACK and ACK for HTTP/1.1 and HTTP/2; HTTP/3 uses QUIC over UDP.',
      'TLS authenticates the server with a certificate and establishes keys for encrypted, integrity-checked communication.',
      'HTTPS is HTTP inside a protected channel, not a different application protocol and not a guarantee of application security.',
      'An HTTP request has a request line, headers and an optional body; a response has a status line, headers and a body.',
      'Caching and connection reuse remove repeated work but introduce freshness and management concerns.',
      'The mental model is URL → DNS → IP Address → Transport Connection → TLS → HTTP Request → Server → HTTP Response.',
    ],
    nextSteps: [
      'Complete the product page challenge before checking any external solution.',
      'Name the affected stage the next time a web request is slow, unreachable or insecure.',
    ],
  },
]
