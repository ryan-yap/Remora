/**
 * Created by KangShiang on 2016-05-05.
 */
function JsonResponse(data, type, url, method, error) {
    this.head = {
        type : type,
        url	: url,
        method : method,
    };
    this.data = data;
    this.error = error;
}

module.exports = JsonResponse;
/**
 * Created by KangShiang on 2016-05-09.
 */
