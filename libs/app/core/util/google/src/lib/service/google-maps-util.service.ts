/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { AbstractService } from '@project/app-core-api';
import { ConfigUtilService } from '@project/app-core-util-config';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class GoogleMapsUtilService extends AbstractService {
  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  private get googleMapsApiKey(): string {
    return this.configService.get<string>('google.maps.api_key') as string;
  }

  autocompleteOptions = {
    fields: ['address_components', 'formatted_address', 'geometry', 'name'],
    strictBounds: false,
    types: ['address'],
    componentRestrictions: { country: 'es' }
  };

  googleSearchBindInputAutocomplete(
    inputElem: HTMLInputElement
  ): Observable<any> {
    const result$: Subject<any> = new Subject<any>();

    const loader = new Loader({
      apiKey: this.googleMapsApiKey,
      version: 'weekly'
    });

    loader.importLibrary('places').then(() => {
      const addressAutocomplete = new google.maps.places.Autocomplete(
        inputElem,
        this.autocompleteOptions
      );

      addressAutocomplete.addListener('place_changed', () => {
        const place = addressAutocomplete.getPlace();
        result$.next(place);
        result$.complete();
      });
    });

    return result$.asObservable();
  }
}
