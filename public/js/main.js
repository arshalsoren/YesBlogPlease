$(document).ready(() => {
    $('.delete-page').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/page/' + id,
            success: (response) => {
                alert('Deleting Page');
                window.location.href = '/';
            },
            error: (err) => {
                console.log(err);
            }
        });
    }); 
});