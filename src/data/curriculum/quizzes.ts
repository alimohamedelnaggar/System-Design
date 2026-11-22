import type { Quiz } from '../../types/curriculum.ts'

/** Quiz data is stored separately so content files stay focused on prose. */
export const quizzes: Quiz[] = [
  {
    id: 'quiz-1-1',
    title: 'What is System Design? — knowledge check',
    description: 'Five questions to check the core distinctions from this lesson.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-1-q1',
        prompt:
          'A team is deciding which parts of an online store should own checkout, where order data will be stored, and how the browser will communicate with those parts. What is this work called?',
        options: [
          {
            id: 'quiz-1-1-q1-a',
            label: 'Debugging an existing defect',
            isCorrect: false,
            explanation: 'Debugging finds and fixes a wrong behaviour; it does not define the structure of the system.',
          },
          {
            id: 'quiz-1-1-q1-b',
            label: 'System design',
            isCorrect: true,
            explanation:
              'System design defines components, responsibilities, communication and data flow so the system meets its requirements.',
          },
          {
            id: 'quiz-1-1-q1-c',
            label: 'Syntax formatting',
            isCorrect: false,
            explanation: 'Formatting changes how code looks, not how components are organised or communicate.',
          },
          {
            id: 'quiz-1-1-q1-d',
            label: 'Unit testing',
            isCorrect: false,
            explanation: 'Unit testing checks small pieces of code; it assumes the structure already exists.',
          },
        ],
        explanation: 'The decisions described are about the shape of the whole application, not one implementation detail.',
      },
      {
        id: 'quiz-1-1-q2',
        prompt: 'Which statement is a non-functional requirement for the store?',
        options: [
          {
            id: 'quiz-1-1-q2-a',
            label: 'Users can add products to a basket.',
            isCorrect: false,
            explanation: 'This is a capability a user can perform, so it is a functional requirement.',
          },
          {
            id: 'quiz-1-1-q2-b',
            label: 'The product API responds within 200 ms at 1,000 requests per second.',
            isCorrect: true,
            explanation:
              'This is a measurable quality attribute with a workload condition, so it is a non-functional requirement.',
          },
          {
            id: 'quiz-1-1-q2-c',
            label: 'Users can track order status.',
            isCorrect: false,
            explanation: 'Tracking an order is observable behaviour, which makes it functional.',
          },
          {
            id: 'quiz-1-1-q2-d',
            label: 'Admins can remove a product listing.',
            isCorrect: false,
            explanation: 'An admin action is still a system capability, not a quality attribute.',
          },
        ],
        explanation: 'Functional requirements say what the system does; non-functional requirements say how well it does it.',
      },
      {
        id: 'quiz-1-1-q3',
        prompt: 'A product page reads the same catalogue data many times. What is the main reason to add a cache?',
        options: [
          {
            id: 'quiz-1-1-q3-a',
            label: 'To permanently replace the database as the source of truth.',
            isCorrect: false,
            explanation: 'A cache holds copies; the database remains the durable source of truth.',
          },
          {
            id: 'quiz-1-1-q3-b',
            label: 'To avoid repeating an expensive read by keeping a fast, temporary copy.',
            isCorrect: true,
            explanation: 'A cache stores a result so repeated reads can be served without repeating the expensive work.',
          },
          {
            id: 'quiz-1-1-q3-c',
            label: 'To guarantee that every response uses only the newest data.',
            isCorrect: false,
            explanation: 'Caches can serve stale data if the underlying data changes before the copy is refreshed.',
          },
          {
            id: 'quiz-1-1-q3-d',
            label: 'To remove the need for an API contract between components.',
            isCorrect: false,
            explanation: 'A cache sits behind the API; it does not define or replace the communication contract.',
          },
        ],
        explanation: 'The benefit is faster repeated reads; the cost is the need to manage freshness.',
      },
      {
        id: 'quiz-1-1-q4',
        prompt:
          'A service answers every request, but it sometimes returns the wrong order total. Which statement best describes the situation?',
        options: [
          {
            id: 'quiz-1-1-q4-a',
            label: 'It is reliable but not available.',
            isCorrect: false,
            explanation: 'It is reachable, so it is available; incorrect results make it unreliable.',
          },
          {
            id: 'quiz-1-1-q4-b',
            label: 'It is available but not reliable.',
            isCorrect: true,
            explanation: 'Availability concerns reachability; reliability concerns correct behaviour over time.',
          },
          {
            id: 'quiz-1-1-q4-c',
            label: 'It is neither available nor reliable.',
            isCorrect: false,
            explanation: 'It is available because requests are answered; the failure is in correctness.',
          },
          {
            id: 'quiz-1-1-q4-d',
            label: 'Availability and reliability are identical, so the distinction does not apply.',
            isCorrect: false,
            explanation: 'They are distinct qualities: a system can be reachable while producing wrong results.',
          },
        ],
        explanation: 'Ask two separate questions: can users reach the system, and does it behave correctly?',
      },
      {
        id: 'quiz-1-1-q5',
        prompt:
          'A small store grows from 10 to 100,000 users. A proposal adds two application servers behind a load balancer and a cache for product reads. What is the most balanced evaluation?',
        options: [
          {
            id: 'quiz-1-1-q5-a',
            label: 'It is always the correct architecture for any growing application.',
            isCorrect: false,
            explanation: 'Architecture depends on requirements and constraints; there is no universal answer.',
          },
          {
            id: 'quiz-1-1-q5-b',
            label: 'It removes the need to measure performance or define requirements.',
            isCorrect: false,
            explanation: 'Adding components increases the need to verify that they solve a measured problem.',
          },
          {
            id: 'quiz-1-1-q5-c',
            label:
              'It can improve capacity and read latency, but it adds coordination, cost and possible stale data.',
            isCorrect: true,
            explanation: 'This names both the likely benefit and the costs, which is how trade-offs should be evaluated.',
          },
          {
            id: 'quiz-1-1-q5-d',
            label: 'It only changes deployment, not correctness or failure behaviour.',
            isCorrect: false,
            explanation: 'More instances and a cache change failure paths, freshness and operational complexity.',
          },
        ],
        explanation: 'Good design reasoning states what improves and what is accepted in return.',
      },
    ],
  },
  {
    id: 'quiz-1-2',
    title: 'Client-Server Architecture — knowledge check',
    description: 'Five questions about clients, servers, request flow, state and architectural tiers.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-2-q1',
        prompt:
          'A shopper’s browser collects a product id, sends GET /api/products/42 and displays the returned product. Which statement best describes the browser in this interaction?',
        options: [
          {
            id: 'quiz-1-2-q1-a',
            label: 'It is the database because it stores the product row.',
            isCorrect: false,
            explanation: 'The browser does not store the durable catalogue; the database does.',
          },
          {
            id: 'quiz-1-2-q1-b',
            label: 'It is the client because it starts the request and handles the response.',
            isCorrect: true,
            explanation: 'A client initiates an interaction and processes or displays what the server returns.',
          },
          {
            id: 'quiz-1-2-q1-c',
            label: 'It is the application tier because it applies shared pricing rules.',
            isCorrect: false,
            explanation: 'Shared pricing rules belong on the server; the browser handles presentation and user input.',
          },
          {
            id: 'quiz-1-2-q1-d',
            label: 'It is the network because it carries the request bytes.',
            isCorrect: false,
            explanation: 'The network carries bytes between components; it is not the program that starts the request.',
          },
        ],
        explanation: 'The browser acts as a client even though the product data comes from another program.',
      },
      {
        id: 'quiz-1-2-q2',
        prompt:
          'An API receives GET /api/products/42, checks that the product is visible, reads the stored row and returns 200 with JSON. Which responsibility belongs to the server here?',
        options: [
          {
            id: 'quiz-1-2-q2-a',
            label: 'Deciding the browser’s final page layout.',
            isCorrect: false,
            explanation: 'Rendering the final layout is a presentation responsibility of the client.',
          },
          {
            id: 'quiz-1-2-q2-b',
            label: 'Choosing the screen size of the shopper’s device.',
            isCorrect: false,
            explanation: 'Device characteristics come from the client; the server does not choose them.',
          },
          {
            id: 'quiz-1-2-q2-c',
            label: 'Applying the visibility rule and returning the product result.',
            isCorrect: true,
            explanation: 'Servers apply shared rules, access data when needed and build the response.',
          },
          {
            id: 'quiz-1-2-q2-d',
            label: 'Removing the need for a data store.',
            isCorrect: false,
            explanation: 'A server often reads or writes a durable store; it does not eliminate the need for one.',
          },
        ],
        explanation: 'Server responsibilities include validation, business rules, data access and response creation.',
      },
      {
        id: 'quiz-1-2-q3',
        prompt: 'Which sequence correctly orders the request-response cycle?',
        options: [
          {
            id: 'quiz-1-2-q3-a',
            label: 'Server response, client request, database query, user action.',
            isCorrect: false,
            explanation: 'The cycle starts with a user action and a client request, not with a response.',
          },
          {
            id: 'quiz-1-2-q3-b',
            label:
              'User action, client prepares a request, server processes it, response returns, client displays the result.',
            isCorrect: true,
            explanation: 'This is the complete request-response order described in the lesson.',
          },
          {
            id: 'quiz-1-2-q3-c',
            label: 'Client displays the result, user acts, server prepares a request, network creates data.',
            isCorrect: false,
            explanation: 'Display happens after the response; the network transports data rather than creating it.',
          },
          {
            id: 'quiz-1-2-q3-d',
            label: 'Database query, client request, user action, response.',
            isCorrect: false,
            explanation: 'The user acts first, and the server queries the database during processing.',
          },
        ],
        explanation: 'Trace the message from the caller to the processor and back to the caller.',
      },
      {
        id: 'quiz-1-2-q4',
        prompt:
          'A product API accepts a token and product id with every request. Any server instance can answer without remembering an earlier click. Which statement is accurate?',
        options: [
          {
            id: 'quiz-1-2-q4-a',
            label:
              'This is stateless communication, but the application may still store products in a database.',
            isCorrect: true,
            explanation:
              'Stateless means the request does not need remembered conversation context; durable data storage is separate.',
          },
          {
            id: 'quiz-1-2-q4-b',
            label: 'This is stateful because the database stores product data.',
            isCorrect: false,
            explanation: 'Stored data alone does not make the communication stateful; session context is the issue.',
          },
          {
            id: 'quiz-1-2-q4-c',
            label: 'This is stateless, so the server cannot use caches or databases.',
            isCorrect: false,
            explanation: 'Stateless systems can use databases and caches; they simply do not depend on remembered request context.',
          },
          {
            id: 'quiz-1-2-q4-d',
            label: 'This is stateful because the browser can keep a page history.',
            isCorrect: false,
            explanation: 'Browser history is client-side convenience; it does not make the server remember a session.',
          },
        ],
        explanation: 'Ask what context the server must remember between requests, not whether data is stored anywhere.',
      },
      {
        id: 'quiz-1-2-q5',
        prompt:
          'A catalog must serve web and mobile clients with identical prices and controlled database access. Which architectural reasoning best fits?',
        options: [
          {
            id: 'quiz-1-2-q5-a',
            label: 'Two tiers are always better because they contain fewer boxes.',
            isCorrect: false,
            explanation: 'Fewer components can help, but the choice depends on rules, callers and access control.',
          },
          {
            id: 'quiz-1-2-q5-b',
            label: 'Three tiers are always better because they are more modern.',
            isCorrect: false,
            explanation: 'Architecture is not a trend ranking; another boundary must solve a real need.',
          },
          {
            id: 'quiz-1-2-q5-c',
            label:
              'A 3-tier design can centralise pricing rules and mediate database access, at the cost of another boundary.',
            isCorrect: true,
            explanation:
              'This names the benefits for multiple clients and the cost of the extra application tier.',
          },
          {
            id: 'quiz-1-2-q5-d',
            label: 'A 2-tier design is required because logical tiers must be physical servers.',
            isCorrect: false,
            explanation: 'Tiers are logical responsibilities; physical deployment is a separate decision.',
          },
        ],
        explanation: 'Choose a structure by matching shared rules, data access and operational cost to the requirements.',
      },
    ],
  },
  {
    id: 'quiz-1-3',
    title: 'Web Fundamentals — knowledge check',
    description: 'Five questions on DNS, HTTP, HTTPS, transport and the complete browser journey.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-3-q1',
        prompt:
          'A shopper opens https://shop.example.com/products. The browser and operating-system DNS caches are empty. Which statement best describes how the destination IP address is found?',
        options: [
          {
            id: 'quiz-1-3-q1-a',
            label: 'A root server keeps a complete list of every website and returns the final answer directly.',
            isCorrect: false,
            explanation:
              'Root servers refer clients to the appropriate TLD servers; they do not hold a complete directory of all names.',
          },
          {
            id: 'quiz-1-3-q1-b',
            label:
              'A recursive resolver asks a root server, then the .com TLD server, then the authoritative server for example.com, and caches the returned record for its TTL.',
            isCorrect: true,
            explanation:
              'This is the full conceptual lookup path when caches are empty. The TTL bounds how long the answer may be reused.',
          },
          {
            id: 'quiz-1-3-q1-c',
            label: 'The browser sends the domain name to a search engine, which replies with the server address.',
            isCorrect: false,
            explanation: 'Search engines are not part of name resolution; DNS performs this lookup.',
          },
          {
            id: 'quiz-1-3-q1-d',
            label: 'The authoritative server downloads the product page and sends it to the browser along with the address.',
            isCorrect: false,
            explanation: 'Authoritative DNS servers answer name queries; a separate web server serves the page.',
          },
        ],
        explanation: 'DNS is a distributed lookup hierarchy, and caching means the full path is not always needed.',
      },
      {
        id: 'quiz-1-3-q2',
        prompt:
          'The request for /products is about to be sent. Which description of the HTTP request and response is accurate?',
        options: [
          {
            id: 'quiz-1-3-q2-a',
            label: 'Every HTTP request must contain a body; otherwise the server cannot identify the resource.',
            isCorrect: false,
            explanation: 'A GET request normally has no body; the method and request target identify the resource.',
          },
          {
            id: 'quiz-1-3-q2-b',
            label:
              'The request has a request line with method, target and version, then headers and an optional body; the response has a status line, headers and a body.',
            isCorrect: true,
            explanation: 'These are the structural parts of HTTP messages; the blank line separates headers from the body.',
          },
          {
            id: 'quiz-1-3-q2-c',
            label: 'A 200 status code guarantees the shopper will be happy with the business outcome.',
            isCorrect: false,
            explanation:
              'A status reports how the request was handled; the body can still report an out-of-stock item or another outcome.',
          },
          {
            id: 'quiz-1-3-q2-d',
            label: 'The browser queries the product database directly and the server only renders HTML.',
            isCorrect: false,
            explanation: 'The server owns data access; the browser sends an HTTP request rather than a database query.',
          },
        ],
        explanation: 'HTTP is a request-response protocol whose messages have a defined line, headers and optional body.',
      },
      {
        id: 'quiz-1-3-q3',
        prompt: 'Which statement best captures what HTTPS adds to a web request?',
        options: [
          {
            id: 'quiz-1-3-q3-a',
            label: 'It replaces HTTP with a completely different application protocol.',
            isCorrect: false,
            explanation: 'The messages are still HTTP; they are carried inside a TLS-protected connection.',
          },
          {
            id: 'quiz-1-3-q3-b',
            label:
              'TLS validates the server certificate, establishes keys for encrypted and integrity-checked messages, and reduces transport risks without guaranteeing application security.',
            isCorrect: true,
            explanation:
              'This names the confidentiality, integrity and authentication benefits while keeping the security limit explicit.',
          },
          {
            id: 'quiz-1-3-q3-c',
            label: 'It encrypts DNS lookups and hides the destination address and all traffic patterns.',
            isCorrect: false,
            explanation: 'HTTPS protects the HTTP connection; it does not make every property of the network invisible.',
          },
          {
            id: 'quiz-1-3-q3-d',
            label: 'The TLS handshake always follows the same fixed sequence in every version and configuration.',
            isCorrect: false,
            explanation: 'Handshake details and round trips vary by TLS version and configuration.',
          },
        ],
        explanation: 'HTTPS is transport protection around HTTP, not a different protocol and not complete application security.',
      },
      {
        id: 'quiz-1-3-q4',
        prompt: 'Before an HTTP/1.1 request can be sent over a new TCP connection, what happens?',
        options: [
          {
            id: 'quiz-1-3-q4-a',
            label: 'The browser sends SYN, the server replies SYN-ACK, the browser sends ACK, and both sides hold state for a reliable byte stream.',
            isCorrect: true,
            explanation: 'This three-way handshake establishes the connection before TLS negotiation and HTTP messages.',
          },
          {
            id: 'quiz-1-3-q4-b',
            label: 'A single SYN message reserves the connection, so no acknowledgement is needed.',
            isCorrect: false,
            explanation: 'Both sides must agree; the SYN-ACK and ACK messages complete the agreement.',
          },
          {
            id: 'quiz-1-3-q4-c',
            label: 'TCP defines the HTTP method, headers and status codes used in the request.',
            isCorrect: false,
            explanation: 'TCP provides a reliable byte stream; HTTP defines the application messages carried on it.',
          },
          {
            id: 'quiz-1-3-q4-d',
            label: 'HTTP/3 must also perform this TCP handshake because it relies on TCP.',
            isCorrect: false,
            explanation: 'HTTP/3 uses QUIC over UDP and establishes its connection differently.',
          },
        ],
        explanation: 'Connection setup is a transport concern, separate from DNS and from HTTP message format.',
      },
      {
        id: 'quiz-1-3-q5',
        prompt:
          'Which ordering best represents the simplified journey from entering https://shop.example.com/products to seeing the page?',
        options: [
          {
            id: 'quiz-1-3-q5-a',
            label:
              'Parse URL, check caches, resolve DNS, establish transport, negotiate TLS, send HTTP request, server processes, return HTTP response, render.',
            isCorrect: true,
            explanation:
              'This follows the logical dependencies: each stage needs the result of the one before it.',
          },
          {
            id: 'quiz-1-3-q5-b',
            label:
              'Negotiate TLS, resolve DNS, establish transport, send the request, then check caches after the response.',
            isCorrect: false,
            explanation: 'TLS needs a connection to an address, so DNS and transport must come first.',
          },
          {
            id: 'quiz-1-3-q5-c',
            label: 'Resolve DNS, download the page, then parse the URL to decide which server to contact.',
            isCorrect: false,
            explanation: 'The browser must parse the URL before it knows which name to resolve.',
          },
          {
            id: 'quiz-1-3-q5-d',
            label: 'Send the HTTP request first, then resolve DNS if the server cannot be reached.',
            isCorrect: false,
            explanation: 'An address and a connection are required before an HTTP request can be delivered.',
          },
        ],
        explanation:
          'Real browsers may reuse connections or fetch assets in parallel, but this is the conceptual sequence.',
      },
    ],
  },
]
