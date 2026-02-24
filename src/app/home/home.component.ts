import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  imports: [],
})
export class HomeComponent {
  contactFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSeQQ0w9o5QJ8yBTF40kl3VpqbVqAW1TBJNhuynfS47SO8AhsA/viewform?usp=dialog';

  constructor() {}
}
