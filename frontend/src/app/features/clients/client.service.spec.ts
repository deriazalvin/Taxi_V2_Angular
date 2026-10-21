import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('demande la premiere page par defaut', () => {
    service.list().subscribe();

    const request = httpMock.expectOne((r) => r.url === '/api/clients');
    expect(request.request.params.get('page')).toBe('0');
    expect(request.request.params.get('size')).toBe('10');
    expect(request.request.params.has('keyword')).toBe(false);
  });

  it('transmet la pagination et la recherche', () => {
    service.list({ page: 3, size: 20, keyword: ' Sophie ' }).subscribe();

    const request = httpMock.expectOne((r) => r.url === '/api/clients');
    expect(request.request.params.get('page')).toBe('3');
    expect(request.request.params.get('size')).toBe('20');
    expect(request.request.params.get('keyword')).toBe('Sophie');
  });

  it('ignore une recherche vide', () => {
    service.list({ keyword: '   ' }).subscribe();

    const request = httpMock.expectOne((r) => r.url === '/api/clients');
    expect(request.request.params.has('keyword')).toBe(false);
  });

  it('cree un client avec un corps JSON', () => {
    service
      .create({ name: 'Client A', phone: '0600000000', email: null, address: null })
      .subscribe();

    const request = httpMock.expectOne('/api/clients');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.name).toBe('Client A');
  });

  it('met a jour un client sur /api/clients/{id}', () => {
    service
      .update(7, { name: 'Client B', phone: '0600000001', email: null, address: null })
      .subscribe();

    const request = httpMock.expectOne('/api/clients/7');
    expect(request.request.method).toBe('PUT');
  });

  it('supprime un client', () => {
    service.delete(7).subscribe();

    const request = httpMock.expectOne('/api/clients/7');
    expect(request.request.method).toBe('DELETE');
  });
});
