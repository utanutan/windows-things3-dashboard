// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_MOCK_MODE = 'true'
process.env.NEXT_PUBLIC_AUTO_REFRESH_INTERVAL = '60000'
process.env.API_BASE_URL = 'http://localhost:8000'
process.env.API_TIMEOUT = '10000'
process.env.API_MAX_RETRIES = '3'

// Note: MSW server setup commented out due to module import issues in Jest
// Uncomment when API integration tests are needed:
// import { server } from './src/mocks/server'
// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())
