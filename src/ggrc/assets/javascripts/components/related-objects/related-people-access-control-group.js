/*
  Copyright (C) 2018 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import {
  isSnapshot,
} from '../../plugins/utils/snapshot-utils';
import Permission from '../../permission';

export default can.Component.extend({
  tag: 'related-people-access-control-group',
  viewModel: {
    define: {
      canEdit: {
        get: function () {
          var instance = this.attr('instance');
          var canEdit = !isSnapshot(instance) &&
            !instance.attr('archived') &&
            !this.attr('readOnly') &&
            !this.attr('updatableGroupId') &&
            (this.attr('isNewInstance') ||
              Permission.is_allowed_for('update', instance));

          return canEdit;
        },
      },
      isLoading: {
        get: function () {
          return this.attr('updatableGroupId') ===
            this.attr('groupId');
        },
      },
    },
    instance: {},
    isNewInstance: false,
    groupId: '@',
    title: '@',
    people: [],
    editableMode: false,
    isDirty: false,
    required: false,
    backUpPeople: [],
    autoUpdate: false,
    updatableGroupId: null,
    readOnly: false,

    changeEditableGroup: function (args) {
      if (args.editableMode) {
        this.attr('editableMode', true);
        this.attr('backUpPeople')
          .replace(this.attr('people'));
      } else {
        this.attr('editableMode', false);
        this.attr('isDirty', false);
        this.attr('people').replace(this.attr('backUpPeople'));
      }
    },
    saveChanges: function () {
      this.attr('editableMode', false);

      if (this.attr('isDirty')) {
        this.attr('isDirty', false);
        this.dispatch({
          type: 'updateRoles',
          people: this.attr('people'),
          roleId: this.attr('groupId'),
          roleTitle: this.attr('title'),
        });
      }
    },
    personSelected: function (args) {
      this.addPerson(args.person, args.groupId);
    },
    addPerson: function (person, groupId) {
      var exist = _.find(this.attr('people'), {id: person.id});

      if (exist) {
        console.warn('User ', person.id,
          'already has role', groupId, 'assigned');
        return;
      }

      this.attr('isDirty', true);
      this.attr('people').push(person);

      if (this.attr('autoUpdate')) {
        this.saveChanges();
      }
    },
    removePerson: function (args) {
      var person = args.person;
      var idx = _.findIndex(
        this.attr('people'),
        {id: person.id});

      this.attr('isDirty', true);
      this.attr('people').splice(idx, 1);

      if (this.attr('autoUpdate')) {
        this.saveChanges();
      }
    },
  },
  events: {
    init: function ($element, options) {
      var vm = this.viewModel;
      vm.attr('backUpPeople').replace(vm.attr('people'));
    },
  },
});
