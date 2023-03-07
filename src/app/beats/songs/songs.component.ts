import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BeatService } from '../../services/beat.service';
import { Content, Pageable } from '../../interfaces/pageable.interface';
import { Page } from 'ngx-pagination';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit, OnDestroy {

  flag: boolean = false;
  role: string = ''
  // @Input() query:string="";

  results: Content[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>()



  constructor(private beatService: BeatService, private authService: AuthService, private cookies: CookieService) {
  }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 200,
      processing: true
    };

    this.beatService.searchBeats(0, 200)
      .subscribe({
        next: (resp) => {

          this.results = resp.content
          this.dtTrigger.next(this.results)
        },
        error: (error) => {
          console.log(error);

        }
      })


    // this.beatService.searchBeatsPageable(0, 200, "date", '')

    this.authService.isAuthenticated();
    this.role = this.cookies.get('role')



  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // get beats(): Pageable {
  //   // console.log(this.beatService.beats);

  //   return this.beatService.beats
  // }

  secondsToString(seconds: number) {
    var minute: string | number = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second: string | number = seconds % 60;
    second = (second < 10) ? '0' + second : second;
    return minute + ':' + second;
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.beatService.deleteBeat(id)
          .subscribe(
            {
              next: (resp) => {
                console.log(resp)
              },
              error: (error) => {
                console.log(error)
              }
            }
          );

        window.location.reload()
      }
    })
  }
}
