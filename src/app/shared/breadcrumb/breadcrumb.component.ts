import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
  }

  actualRoute: string[] = []
  firstRoute: string | undefined = ""
  separator: string = "/";
  param: string = ''

  ngOnInit(): void {
    //En caso de que haya un parametro lo cogeremos
    this.param = this.route.snapshot.params['id']
    //Convertiremos la ruta actual en un array
    this.actualRoute = this.router.url.slice(1).split(this.separator)
    //Si tenemos un parámetro lo quitaremos para que no se nos añada en el breadCrumb
    this.actualRoute = this.actualRoute.filter(routeParam => routeParam != this.param);
    //Borramos el último ya que no queremos poder acceder a este
    this.firstRoute = this.actualRoute.pop()
  }


}
