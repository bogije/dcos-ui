/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import { componentFromStream } from "data-service";

import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/do";
import "rxjs/observable/empty";

import { Observable } from "rxjs/Observable";

import { addRepository } from "./data/repositoriesStream";
import AddRepositoryFormModal from "./components/AddRepositoryFormModal";

// Imported from the Cosmos Store
const getErrorMessage = (response = {}) => {
  if (typeof response === "string") {
    return response;
  }

  return response.description || response.message || "An error has occurred.";
};

const addRepositoryEven$ = new Subject();
const addRepository$ = addRepositoryEven$
  .switchMap(repository => {
    return addRepository(
      repository.name,
      repository.uri,
      repository.priority
    ).do(() => {
      repository.complete();
    });
  })
  .catch(error => {
    // ticket to improve  on this
    return Observable.of({
      error: getErrorMessage(error.response),
      pendingRequest: false
    });
  });

const RepositoriesAdd = componentFromStream(props$ => {
  return props$.combineLatest(addRepository$.startWith({}), (props, result) => {
    return (
      <AddRepositoryFormModal
        numberOfRepositories={props.numberOfRepositories}
        open={props.open}
        addRepository={value =>
          addRepository$.next({ complete: props.onClose, ...value })}
        onClose={props.onClose}
        errorMsg={result.error}
      />
    );
  });
});

export default RepositoriesAdd;
