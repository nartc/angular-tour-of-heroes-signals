import { Location, NgIf, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { fromAsync } from '../from-observable';
import { Hero } from '../hero';

import { HeroService } from '../hero.service';

@Component({
    selector: 'app-hero-detail',
    standalone: true,
    imports: [NgIf, UpperCasePipe, FormsModule],
    templateUrl: './hero-detail.component.html',
    styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly heroService = inject(HeroService);
    private readonly location = inject(Location);

    readonly id = fromAsync(this.route.paramMap.pipe(map((paramMap) => Number(paramMap.get('id')))));
    readonly hero = signal<Hero>(null!);

    ngOnInit(): void {
        effect(async () => {
            const id = this.id();
            console.log('id', id);
            if (id) {
                const hero = await this.heroService.getHero(id);
                this.hero.set(hero);
            }
        });
    }

    goBack(): void {
        this.location.back();
    }

    onNameChange($event: string) {
        this.hero.mutate((hero) => (hero.name = $event));
    }

    async save() {
        if (this.hero()) {
            await this.heroService.updateHero(this.hero());
            this.goBack();
        }
    }
}
