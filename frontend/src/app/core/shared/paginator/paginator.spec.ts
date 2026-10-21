import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Paginator } from './paginator';

describe('Paginator', () => {
  let fixture: ComponentFixture<Paginator>;
  let paginator: Paginator;
  let emittedPages: number[];
  let emittedSizes: number[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Paginator] }).compileComponents();

    fixture = TestBed.createComponent(Paginator);
    paginator = fixture.componentInstance;
    emittedPages = [];
    emittedSizes = [];
    paginator.pageChange.subscribe((p) => emittedPages.push(p));
    paginator.sizeChange.subscribe((s) => emittedSizes.push(s));

    setInputs(0, 10, 45);
  });

  function setInputs(page: number, size: number, total: number): void {
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('size', size);
    fixture.componentRef.setInput('total', total);
    fixture.detectChanges();
  }

  it('calcule le nombre de pages et les bornes', () => {
    setInputs(2, 10, 45);

    expect(paginator.totalPages()).toBe(5);
    // Page 3 sur 5 : les elements 21 a 30.
    expect(paginator.from()).toBe(21);
    expect(paginator.to()).toBe(30);
  });

  it('plafonne la borne haute sur la derniere page', () => {
    setInputs(4, 10, 45);

    expect(paginator.from()).toBe(41);
    expect(paginator.to()).toBe(45);
  });

  it('gere une liste vide', () => {
    setInputs(0, 10, 0);

    expect(paginator.totalPages()).toBe(1);
    expect(paginator.from()).toBe(0);
    expect(paginator.to()).toBe(0);
  });

  it('active ou desactive les boutons selon la page', () => {
    setInputs(0, 10, 25);

    expect(paginator.canPrevious()).toBe(false);
    expect(paginator.canNext()).toBe(true);

    setInputs(2, 10, 25);

    expect(paginator.canPrevious()).toBe(true);
    expect(paginator.canNext()).toBe(false);
  });

  it('emmet la page demandee', () => {
    setInputs(0, 10, 50);

    paginator.goTo(2);
    expect(emittedPages).toEqual([2]);
  });

  it('ignore une page hors limites', () => {
    setInputs(1, 10, 25);

    paginator.goTo(9);
    paginator.goTo(-1);
    paginator.goTo(1);

    expect(emittedPages).toEqual([]);
  });

  it('ne peut pas revenir en arriere depuis la premiere page', () => {
    setInputs(0, 10, 50);

    paginator.previous();
    expect(emittedPages).toEqual([]);
  });

  it('avance d une page', () => {
    setInputs(0, 10, 50);

    paginator.next();
    expect(emittedPages).toEqual([1]);
  });
});
