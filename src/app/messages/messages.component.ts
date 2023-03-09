import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [NgIf, NgFor],
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
})
export class MessagesComponent {
    readonly messageService = inject(MessageService);
}
