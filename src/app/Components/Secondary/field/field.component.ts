import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() type: string;
  typeTemp;
  @Input() placeholder: string;
  @Input() value = '';
  @Input() confirmPass = '';
  @Input() minLength = 1;
  @Input() check = false;

  @Output() valueChange = new EventEmitter();
  @Output() state = new EventEmitter();

  hasEverBeenFocused = false;
  passNotMatch = false;
  lessThanMin = false;
  notEmail = false;
  constructor() {
  }

  onFocus() {
    if (!this.hasEverBeenFocused && this.check) {
      this.hasEverBeenFocused = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && changes.value.previousValue && !changes.value.currentValue && this.check) {
      this.hasEverBeenFocused = false;
    }
    if (changes.confirmPass && changes.confirmPass.currentValue && this.check) {
      this.passNotMatch = (this.type === 'password' && changes.confirmPass.currentValue !== this.value);

      this.notEmail = (this.type === 'email' && !this.isEmail(this.value));
      this.lessThanMin = (this.type === 'password') && (this.value.length < this.minLength && this.value.length > 0);

      if (this.notEmail) {
        this.state.emit(this.placeholder + ' field contains a badly formatted email');
      } else if (this.passNotMatch) {
        this.state.emit(this.placeholder + ' field password does not match');
      } else if (this.lessThanMin) {
        this.state.emit(this.placeholder + ' field too short password');
      } else if (!this.value) {
        this.state.emit(this.placeholder + ' field is required');
      } else {
        this.state.emit('');
      }
    }
  }
  isEmail(emailToTest): boolean {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/.test(emailToTest);
  }
  ngOnInit(): void {
    this.typeTemp = this.type;
  }
  ngAfterViewInit(): void {
    this.state.emit(this.placeholder + ' field is required');
    this.valueChange.subscribe(next => {
      this.notEmail = (this.type === 'email' && !this.isEmail(next));
      this.passNotMatch = (this.type === 'password' && this.confirmPass !== next);
      this.lessThanMin = (this.type === 'password') && (next.length < this.minLength && next.length > 0);

      if (this.notEmail) {
        this.state.emit(this.placeholder + ' field contains a badly formatted email');
      } else if (this.passNotMatch) {
        this.state.emit(this.placeholder + ' field password does not match');
      } else if (this.lessThanMin) {
        this.state.emit(this.placeholder + ' field too short password');
      } else if (!next) {
        this.state.emit(this.placeholder + ' field is required');
      } else {
        this.state.emit('');
      }
    });
  }

}
