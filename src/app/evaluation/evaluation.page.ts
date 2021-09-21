import { LoginPage } from './../login/login.page';
import { Router } from '@angular/router';
import { ApiService } from './../services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import {IonSlides} from '@ionic/angular';

import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.page.html',
  styleUrls: ['./evaluation.page.scss'],
})
export class EvaluationPage implements OnInit {

  questions: any = [];
  question: string;
  responses: any = [];

  course : any = {};
  teacher: any = {};
  student: any = {};

  radioValue: number = 0;
  evaluationNote: any = [];
  isLocked: boolean = true;

  firstSlide: boolean = true;
  questionSlide: boolean = false
  lastSlide: boolean = false;

  result: number = 0;

  comment: string;

  @ViewChild(IonSlides) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: false,
    effect: 'slide'
  };

  constructor(
    public api: ApiService, public toastController: ToastController,
    public router: Router, public storage: Storage
    ) {

    this.course = history.state.course;
    this.student = history.state.st;

    this.api.fetchData('http://localhost:8000/api/teacher/'+ this.course.teacher + '/')
    .subscribe(teacherResult => {
      this.teacher = teacherResult;
    });

  }

  async ngOnInit() {

    await this.storage.create();

    this.api.fetchData('http://localhost:8000/api/question/').subscribe(questionsResult => {
      this.questions = questionsResult;
      this.question = this.questions[1].label;
      this.api.fetchData('http://localhost:8000/api/response/').subscribe(responseResult => {
        this.responses = responseResult;
      });
    });

  }



  beginEvaluation(){
    this.radioValue = 0;
    this.firstSlide = false;
    this.questionSlide = true;
    this.slides.slideNext();
  }

  nextQuestion(){
    if (this.radioValue != 0) {
      this.evaluationNote.push(this.radioValue);
      this.radioValue = 0;
      this.slides.slideNext();
    }else{
      this.presentToast();
    }
  }

  previousQuestion(){
    if (this.evaluationNote.length > 0) {
      this.radioValue = this.evaluationNote.pop();
    }
    this.slides.slidePrev();
  }


  sendEvaluationResult(st: any = {}){
    st = this.student;
    this.evaluationNote.forEach(muk => {
      this.result += muk;
    });

    const evaluationData = {
      course: this.course.id,
      mark: this.result,
      student: this.student.id
    }

    this.api.postData(
      'http://localhost:8000/api/evaluation/',
      evaluationData
    );

    if (this.comment) {

      const commentData = {
        course: this.course.id,
        comment: this.comment
      }
      
      this.api.postData(
        'http://localhost:8000/api/comments/',
        commentData
      );
    }

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }


  ionFocus(radio) {
    this.isLocked = false;
    this.radioValue = Number(radio.el.value);
    this.slides.lockSwipeToNext(false);
  }


  ionSlideDidChange(slides) {
    this.slides.length().then(size => {
      slides.getActiveIndex().then(index => {
        if (index == size-1) {
          this.questionSlide = false;
          this.lastSlide = true;
        }else if (index == 0) {
          this.questionSlide = false;
          this.lastSlide = false;
          this.firstSlide = true;
        }
      })
    })
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Veillez selectionner une reponse !',
      duration: 1100,
      animated: true,
      color: "danger",
      cssClass: 'toast-danger',
      mode: "ios",
      position: "middle"
    });
    toast.present();
  }

}
