/**
 * Created by KangShiang on 2016-05-05.
 */
function JsonResponse(data, type, url, method, message) {
    this.head = {
        type : type,
        url	: url,
        method : method,
    };
    this.data = data;
    this.message = message;
}

module.exports = JsonResponse;
/**
 * Created by KangShiang on 2016-05-09.
 */
