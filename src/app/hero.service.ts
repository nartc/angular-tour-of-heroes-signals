import { Injectable } from '@angular/core';

import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
    private heroesUrl = 'http://localhost:3000/heroes'; // URL to web api

    constructor(private messageService: MessageService) {}

    /** GET heroes from the server */
    getHeroes(): Promise<Hero[]> {
        return fetch(this.heroesUrl, { headers: { 'content-type': 'application/json' } })
            .then((response) => {
                this.log('fetched heroes');
                return response.json();
            })
            .catch(this.handleError('getHeroes', []));
    }

    /** GET hero by id. Will 404 if id not found */
    getHero(id: number): Promise<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return fetch(url, { headers: { 'content-type': 'application/json' } })
            .then((response) => {
                this.log(`fetched hero id=${id}`);
                return response.json();
            })
            .catch(this.handleError(`getHero id=${id}`));
    }

    /* GET heroes whose name contains search term */
    searchHeroes(term: string): Promise<Hero[]> {
        if (!term.trim()) {
            // if not search term, return empty hero array.
            return Promise.resolve([]);
        }

        return fetch(`${this.heroesUrl}?name_like=${term}`, {
            headers: { 'content-type': 'application/json' },
        })
            .then(async (response) => {
                const data = (await response.json()) as Hero[];
                if (data.length) {
                    this.log(`found heroes matching "${term}"`);
                } else {
                    this.log(`no heroes matching "${term}"`);
                }
                return data;
            })
            .catch(this.handleError<Hero[]>('searchHeroes', []));
    }

    //////// Save methods //////////

    /** POST: add a new hero to the server */
    addHero(hero: Hero): Promise<Hero> {
        return fetch(this.heroesUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(hero),
        })
            .then((response) => {
                this.log(`added hero w/ name=${hero.name}`);
                return response.json();
            })
            .catch(this.handleError('addHero'));
    }

    /** DELETE: delete the hero from the server */
    deleteHero(id: number): Promise<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return fetch(url, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
        })
            .then((response) => {
                this.log(`deleted hero id=${id}`);
                return response.json();
            })
            .catch(this.handleError('deleteHero'));
    }

    /** PUT: update the hero on the server */
    updateHero(hero: Hero): Promise<any> {
        const url = `${this.heroesUrl}/${hero.id}`;
        return fetch(url, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(hero),
        })
            .then((response) => {
                this.log(`updated hero id=${hero.id}`);
                return response.json();
            })
            .catch(this.handleError('updateHero'));
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Promise<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return Promise.resolve(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }
}
