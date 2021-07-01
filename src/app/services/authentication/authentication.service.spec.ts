import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationServiceTest', () => {
    let service: AuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [HttpClient]
        });

        service = TestBed.inject(AuthenticationService);
    });

    it('AuthenticationService should be created', () => {
        expect(service).toBeTruthy();
    });

    it('decodeJWT should initialize user', () => {
        const token =
            'eyJhbGciOiJIUzUxMiJ9.eyJsYXN0TmFtZSI6IkludGVybmFsIiwicm9sZXMiOlsiUk9MRV9JTlRFUk5BTCJdLCJncm' +
            '91cElkIjoiRS0wMDk4NjMiLCJjb21wYW55TmFtZSI6Ikluc3RpdHV0byBkZSBGZWN1bmRpdGFzIiwiaXNzIjoiY29tL' +
            'mdlbmVzeXN0ZW1zLmRldiIsImZpcnN0TmFtZSI6IkZlbm9tYXRjaCIsImdyb3VwTmFtZSI6IlJvYmVydG8gQ29jbyIs' +
            'ImNvbXBhbnlJZCI6IjJkMTZlYTBmLTMwNWQtNGNiZC1hNmM4LTNiYjFmZTExOGNlZiIsIm5iZiI6MTYxNzA5MjMzMCw' +
            'ibGFuZ0tleSI6ImVuIiwiaWQiOiJhOTVmMTk1OC0wMTZhLTQwZjgtYTM5Ny04YjM2ODM0NDdiYzgiLCJleHAiOjE2MT' +
            'cwOTk1MzAsImlhdCI6MTYxNzA5MjMzMCwiZW1haWwiOiJmZW5vbWF0Y2hfaW50ZXJuYWxAdGVzdC5jb20iLCJhY3Rpd' +
            'mF0ZWQiOnRydWUsImdyb3VwQ29kZSI6IkUtMDA5ODYzIn0.IovdtN8t_7XBvYrfVAnKPR6AyzKVE0uwiLaREmqHiYTN' +
            '-DEb71NKlZLQfdNc4IlYIFVioI4Tf1IcdD1HlnIjUg';

        service.decodeUser(token);

        expect(service.getCurrentUser).toBeDefined();
    });

    it('loadIndex should load index', () => {
        service.loadIndex();

        expect(service.indexSubject.getValue).toBeDefined();
    });
});
