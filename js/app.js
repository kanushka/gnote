(function ($) {

    $(function () {
        app.showInitialNotes();
    }); // end of document ready

    var app = {
        isLoading: true,
        noteList: {},
        lastNote: 300, // first note id
        noteTemplate: $('.noteTemplate'),
        container: $('.first-col-group')
    };


    /**
     * 
     *  Event listeners for UI elements
     * 
     */

    $('#mainActionBtn').click(event => {
        $('#mainActionBtn').removeClass('pulse');
    });

    $('.show-note-modal').click(function () {
        let noteId = $(this).find('.note-id').val();

        if (!app.noteList.hasOwnProperty(noteId)) {
            M.toast({
                html: 'Something went wrong. cannot open the note'
            });
            return;
        }

        $('#noteId').val(noteId);
        $('#noteTitle').val(app.noteList[noteId].title);
        $('#noteBody').val(app.noteList[noteId].body);

        $('#btnNoteDelete').show();

        M.textareaAutoResize($('#noteBody'));
        M.updateTextFields();

        $('#editNoteModal').modal('open');
    });

    $('#btnAddNote').click(event => {
        app.clearNoteModal();
        $('#editNoteModal').modal('open');
        return;

        let noteId = app.lastNote++;
        let noteData = {
            noteId: noteId,
            title: 'test note title',
            body: 'test note body',
            createdTime: 'test note body',
            modifiedTime: formatDate(new Date())
        }

        app.noteList[noteId] = noteData;
        app.addNoteUI(noteData);

        app.saveNotes();
    });

    $('#btnNoteSave').click(event => {
        let noteId = $('#noteId').val();
        if(noteId == '' || noteId == null){
            // new note
            app.addNote();
        }else{
            // update note     
            app.updateNote(noteId);       
        }
    });

    /**
     * 
     *  Methods to update/refresh the UI
     * 
     */
    app.showInitialNotes = function () {
        let noteString = localStorage.noteList;
        if (noteString == '' || noteString == null) {
            console.log('there is no initial note');
            $('#mainActionBtn').addClass('pulse');
            return;
        }

        app.noteList = JSON.parse(noteString);

        for (let noteId in app.noteList) {
            if (app.noteList.hasOwnProperty(noteId)) {
                let note = app.noteList[noteId];
                app.addNoteUI(note);
                app.lastNote = noteId;
            }
        }

        console.log('initial notes are loaded');
    }   

    app.addNote = function(){
        let noteId = ++(app.lastNote);
        let noteData = {
            noteId: noteId,
            title: $('#noteTitle').val(),
            body: $('#noteBody').val(),
            createdTime: formatDate(new Date()),
            modifiedTime: formatDate(new Date()),
            isActive = 1 // 0 - deleted, 1 - active
        }

        app.noteList[noteId] = noteData;
        app.addNoteUI(noteData);

        app.saveNotes();
    }

    app.updateNote = function(noteId){
        let title = $('#noteTitle').val();
        let body = $('#noteBody').val();
        let modifiedTime = formatDate(new Date());

        // remove note UI
        $(`#note_${noteId}`).remove();
        
        // add new note
        let noteData = {
            noteId: noteId,
            title: title,
            body: body,            
            modifiedTime: modifiedTime
        }
        app.addNoteUI(noteData);

        // update object
        app.noteList[noteId].title = title;
        app.noteList[noteId].body = body;
        app.noteList[noteId].modifiedTime = modifiedTime;

        // update in local storage
        app.saveNotes();
    }

    app.clearNoteModal = function () {
        $('#noteId').val('');
        $('#noteTitle').val('');
        $('#noteBody').val('');

        $('#btnNoteDelete').hide();

        M.textareaAutoResize($('#noteBody'));
        M.updateTextFields();
    }

    app.addNoteUI = function (data) {
        let note = app.noteTemplate.clone(true).prop('id', `note_${data.noteId}`);

        note.find('.note-id').val(data.noteId);
        note.find('.card-title-text').html(data.title);
        note.find('.card-content-text').html(data.body);
        note.find('.card-modified-time').html(data.modifiedTime);

        note.removeAttr('hidden');
        app.container.prepend(note);
    }
    
    /**
     * 
     *   Methods for dealing with the model
     * 
     */

    app.saveNotes = function () {
        let noteString = JSON.stringify(app.noteList);
        localStorage.noteList = noteString;
    };



    function formatDate(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() + "  " + strTime;
    }


})(jQuery); // end of jQuery name space