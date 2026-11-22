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
]
