import { describe,it,expect } from 'vitest'; import request from 'supertest'; import { app } from '../src/app';
describe('health endpoint',()=>it('returns service status',async()=>{const r=await request(app).get('/health');expect(r.status).toBe(200);expect(r.body.status).toBe('ok');}));
