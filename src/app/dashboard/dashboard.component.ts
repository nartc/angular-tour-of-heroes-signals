import { NgFor } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hero } from '../hero';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { HeroService } from '../hero.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [NgFor, RouterLink, HeroSearchComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    private readonly heroService = inject(HeroService);

    readonly heroes = signal<Hero[]>([]);
    readonly topHeroes = computed(() => this.heroes().slice(1, 5));

    ngOnInit(): void {
        this.getHeroes();
    }

    async getHeroes() {
        const heroes = await this.heroService.getHeroes();
        this.heroes.set(heroes);
    }
}
