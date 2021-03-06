/*
 Copyright (C) 2018 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import Component from '../ca-object-modal-content';
import {getComponentVM} from '../../../../js_specs/spec_helpers';

describe('ca-object-modal-content component', ()=> {
  let viewModel;

  beforeEach(()=> {
    viewModel = getComponentVM(Component);
  });

  describe('onCommentCreated() method', ()=> {
    let comment;

    beforeEach(()=> {
      viewModel.attr({
        instance: new can.Map(),
        state: {},
        content: {
          contextScope: {
            errorsMap: {},
            validation: {},
            valueId: jasmine.createSpy(),
          },
        },
      });
      comment = new can.Map();
    });

    it('call "addComment" when saveDfd resolved', (done)=> {
      let saveDfd = can.Deferred();
      viewModel.attr('content.saveDfd', saveDfd);
      spyOn(viewModel, 'addComment');
      spyOn(GGRC.Utils, 'getAssigneeType');

      viewModel.onCommentCreated({
        comment,
      });

      expect(viewModel.addComment).not.toHaveBeenCalled();

      saveDfd.resolve().then(()=> {
        expect(viewModel.addComment).toHaveBeenCalled();
        done();
      });
    });
  });
});
