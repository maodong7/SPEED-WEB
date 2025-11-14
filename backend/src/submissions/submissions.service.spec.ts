import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from './submissions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Submission } from './schemas/submission.schema';

describe('SubmissionsService', () => {
  let service: SubmissionsService;
  let model: { find: jest.Mock; findOne: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    model = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        {
          provide: getModelToken(Submission.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
  });

  it('should find pending submissions', async () => {
    const mockSubmissions = [{ title: 'Test', doi: '10.0.0', email: 'test@test.com', author: 'Test Author' }];
    model.find.mockResolvedValue(mockSubmissions);
    
    const result = await service.findPending();
    expect(result).toEqual(mockSubmissions);
    expect(model.find).toHaveBeenCalledWith({ status: 'pending' });
  });
});