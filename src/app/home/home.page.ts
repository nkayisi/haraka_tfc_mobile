import { EvaluationPage } from './../evaluation/evaluation.page';
import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  draft_courses: any = [];
  courses = new Set();
  evaluations: any = [];
  student: any = {};
  faculty: any = {};
  promotion: any = {};


  constructor(
    private api: ApiService, public router: Router,
    public storage: Storage
  ) {

    this.student = history.state.st;

    this.api.fetchData('http://localhost:8000/api/faculty/'+this.student.faculty+'/')
    .subscribe(result => {
      this.faculty = result;
      this.api.fetchData('http://localhost:8000/api/promotion/'+this.student.promotion+'/')
      .subscribe(result => {
        this.promotion = result;
      });
    });
  

  }

  signOut() {
    this.storage.clear().then(() => {
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    });
  }

  async getData(key) {
    return await this.storage.get(key);
  }

  async evaluate(course: any = {}, st: any = {}) {
    st = this.student;
    this.router.navigate(['/evaluation'], { state: { course, st } });
  }


ngOnInit() {
  
  this.api.fetchData('http://localhost:8000/api/course/?faculry='+this.student.faculty+'&promotion='+this.student.promotion)
  .subscribe(result => {
    this.draft_courses = result;

    this.api.fetchData('http://localhost:8000/api/evaluation/?student='+this.student.id)
    .subscribe(result => {
      this.evaluations = result;

      if (this.evaluations.length > 0) {
        this.evaluations.forEach(evaluation => {
          this.draft_courses.forEach(course => {
            if (evaluation.course !== course.id) {
              this.courses.add(course);
            }
          });
        });
      }else{
        this.draft_courses.forEach(course => {
            this.courses.add(course);
        });
      }

    });
  });
  
}

}
