import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fromAsync } from '../from-observable';

import { HeroService } from '../hero.service';

@Component({
    selector: 'app-hero-search',
    standalone: true,
    imports: [NgFor, RouterLink, AsyncPipe],
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent {
    private readonly heroService = inject(HeroService);

    readonly searchTerms = new Subject<string>();
    readonly heroes = fromAsync(
        this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            switchMap((term: string) => this.heroService.searchHeroes(term))
        ),
        []
    );
}
