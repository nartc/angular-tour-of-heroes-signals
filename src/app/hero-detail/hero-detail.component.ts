import { Location, NgIf, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
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
export default class HeroDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly heroService = inject(HeroService);
    private readonly location = inject(Location);

    private readonly asyncHero = fromAsync(
        this.route.paramMap.pipe(
            map((paramMap) => Number(paramMap.get('id'))),
            switchMap((id) => this.heroService.getHero(id))
        ),
        null
    );
    readonly hero = signal<Hero>(null!);

    ngOnInit() {
        // is effect() bad?
        effect(() => {
            const hero = this.asyncHero();
            if (hero) this.hero.set(hero);
        });
    }

    goBack(): void {
        this.location.back();
    }

    onNameChange($event: string) {
        this.hero.mutate((hero) => (hero.name = $event));
    }

    async save() {
        await this.heroService.updateHero(this.hero());
        this.goBack();
    }
}
