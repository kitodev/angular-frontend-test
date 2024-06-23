import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TApiResponse, TInitialApiResponse } from '@api/models/response.model';
import { TRole, TUpdateRole } from '@api/models/role.model';
import { TComment, TCreateComment, TCreateTopic, TTopic } from '@api/models/topic.model';
import { TUser } from '@api/models/user.model';
import { ENVIRONMENT } from '@environments/environment';
import { Observable, delay, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _http = inject(HttpClient);

  public init(): Observable<TInitialApiResponse> {
    return this._http.get(ENVIRONMENT.API_URL).pipe(
      retry({
        delay: (error, retryCount) => {
          console.log(`Retrying initial API call (${retryCount})...`);
          return of(error).pipe(delay(3000));
        },
      })
    ) as any;
  }

  public addTopic(topic: TCreateTopic): Observable<TApiResponse<TTopic>> {
    return this._http.post(`${ENVIRONMENT.API_URL}/topic/add`, topic) as Observable<TApiResponse<TTopic>>;
  }

  public deleteTopic(topicId: string): Observable<TApiResponse<object>> {
    return this._http.delete(`${ENVIRONMENT.API_URL}/topic/${topicId}`) as Observable<TApiResponse<object>>;
  }

  public addCommentToTopic(topicId: string, comment: TCreateComment): Observable<TApiResponse<TComment>> {
    return this._http.post(`${ENVIRONMENT.API_URL}/topic/${topicId}/comment/add`, comment) as Observable<
      TApiResponse<TComment>
    >;
  }

  // ! API call not working properly
  public addCommentToComment(
    topicId: string,
    commentId: string,
    comment: TCreateComment
  ): Observable<TApiResponse<TComment>> {
    return this._http.post(`${ENVIRONMENT.API_URL}/topic/${topicId}/comment/${commentId}/add`, comment) as Observable<
      TApiResponse<TComment>
    >;
  }

  public deleteComment(topicId: string, commentId: string): Observable<TApiResponse<object>> {
    return this._http.delete(`${ENVIRONMENT.API_URL}/topic/${topicId}/comment/${commentId}`) as Observable<
      TApiResponse<object>
    >;
  }

  public updateUser(user: TUser): Observable<TApiResponse<TUser>> {
    return this._http.put(`${ENVIRONMENT.API_URL}/user/${user.id}`, user) as Observable<TApiResponse<TUser>>;
  }

  public updatePassword(user: TUser, password: string, confirmPassword: string): Observable<TApiResponse<TUser>> {
    return this._http.put(`${ENVIRONMENT.API_URL}/user/${user.id}/password`, {
      password1: password,
      password2: confirmPassword,
    }) as Observable<TApiResponse<TUser>>;
  }

  public updateRole(role: TUpdateRole): Observable<TApiResponse<TRole>> {
    return this._http.put(`${ENVIRONMENT.API_URL}/role/${role.id}`, role.name) as Observable<TApiResponse<TRole>>;
  }
}
