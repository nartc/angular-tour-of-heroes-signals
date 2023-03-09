import { NgFor } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fromAsync } from '../from-observable';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { HeroService } from '../hero.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [NgFor, RouterLink, HeroSearchComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
    readonly heroes = fromAsync(inject(HeroService).getHeroes(), []);
    readonly topHeroes = computed(() => this.heroes().slice(1, 5));
}
