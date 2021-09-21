import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

// Others
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  students: any = [];
  student: any = {};
  matricule: string = '';

  isLogin:boolean = false;

  constructor(
    public router: Router,
    public toastController: ToastController,
    public api: ApiService,
    public storage: Storage
  ) { 

    this.storage.create();

    this.getData('student').then(st => {
      if (st !== null) {
        this.router.navigate(['/home'],  { state: { st } });
      }
    });


  }

  ngOnInit() {

    this.api.fetchData('http://localhost:8000/api/student/')
    .subscribe(studentResult => {
      this.students = studentResult;
    });

  }


  async setData(key, value) {
    await this.storage.set(key, value).then(res => {
      console.log('Set data : ', res);
    });
  }

  async getData(key) {
    return await this.storage.get(key);
  }


  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1100,
      animated: true,
      color: 'danger',
      cssClass: 'toast-danger',
      mode: "ios",
      position: "bottom"
    });
    toast.present();
  }


  login(st: any = {}) {
    
    if (this.matricule == '') {
      this.presentToast('Veillez entrer votre matricule !');
    }else {

      this.students.forEach(student => {
        if (student.matricule == this.matricule) {
          st = student;
          this.student = student;
          
          this.storage.set('student', student);
        }
      });

      if (st != null) {
        this.router.navigate(['/home'],  { state: { st } })
      }else {
        this.presentToast("Etudiant introuvable !");
      }

    }
  }


}
