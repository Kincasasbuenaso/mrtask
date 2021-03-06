import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import {NgForm} from '@angular/forms';
import { ModalSelectStatePage } from '../../pages/modal-select-state/modal-select-state.page';
import { ModalSelectUserPage } from '../../pages/modal-select-user/modal-select-user.page';
import { UserService } from '../../services/user/user.service';
import { TaskService } from '../../services/task/task.service';


@Component({
  selector: 'app-modal-add-task',
  templateUrl: './modal-add-task.page.html',
  styleUrls: ['./modal-add-task.page.scss'],
})
export class ModalAddTaskPage implements OnInit {

  idState:any=1;
  email:string='';
  name:string='Sin Asignar';
  title:string='';
  description:string='';

  constructor(public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private _us:UserService,
              private _ts:TaskService) {

  }

  ngOnInit() {

  }

  saveTask(f:NgForm){
    //console.log(f);
    this._ts.addTask(f.value.title_task,f.value.description_task, f.value.status,f.value.user_email).subscribe(resp=>{
      let data_resp=resp;
      if( data_resp['code'] == 200){
          //console.log(data_resp['message']);
          this.presentToastSuccess(data_resp['message']);
        }else{
          //console.log('error creating user');
          this.presentToastSuccess('Error creating task');
        }
    })
  }

  closeModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async ModalSelectState() {
    const modal = await this.modalCtrl.create({
      component: ModalSelectStatePage,
      componentProps: {
        'idStatus': this.idState
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.idState = dataReturned.data;
        console.log('Modal Sent Data :'+ this.idState);
      }
    });

    return await modal.present();
  }

  async ModalSelectUser() {
    const modalUser = await this.modalCtrl.create({
      component: ModalSelectUserPage,
      componentProps: {
        'email': this.email
      }
    });

    modalUser.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.email = dataReturned.data;
        //console.log('Modal Sent Data User :'+ this.email);
        this._us.getUserByEmail(this.email).subscribe(data=>{
          this.name=data['users'][0].name;
        })
      }
    });

    return await modalUser.present();
  }

  async presentToastSuccess(message:string) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'middle',
      duration: 2000
    });

    toast.onDidDismiss().then((resolve) => {
      this.closeModal();
    });

    toast.present();
  }

}
