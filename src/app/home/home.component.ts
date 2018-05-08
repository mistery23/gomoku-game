import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit  {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      'player1': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      'player2': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
    });
  }

  startGame(form: FormGroup) {
    this.router.navigate(['game'], { queryParams: { player1: form.value.player1 , player2: form.value.player2 } });
  }

}
