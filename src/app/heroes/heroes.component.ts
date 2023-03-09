import { NgFor } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
    selector: 'app-heroes',
    standalone: true,
    imports: [NgFor, RouterLink],
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.css'],
})
export default class HeroesComponent implements OnInit {
    private readonly heroService = inject(HeroService);

    readonly heroes = signal<Hero[]>([]);

    async ngOnInit() {
        await this.getHeroes();
    }

    async getHeroes() {
        const heroes = await this.heroService.getHeroes();
        this.heroes.set(heroes);
    }

    async add(name: string) {
        name = name.trim();
        if (!name) {
            return;
        }
        const newHero = await this.heroService.addHero({ name } as Hero);
        this.heroes.mutate((heroes) => heroes.push(newHero));
    }

    async delete(hero: Hero) {
        this.heroes.update((heroes) => heroes.filter((h) => h.id !== hero.id));
        await this.heroService.deleteHero(hero.id);
    }
}
