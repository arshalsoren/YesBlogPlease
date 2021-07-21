$(document).ready(() => {
    $('.delete-blog').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/blogs/' + id,
            success: (response) => {
                alert('Deleting Blog');
                window.location.href = '/';
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
});