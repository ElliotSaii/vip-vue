import HTTP from "./axios";

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */
export async function LOGIN(email, password) {
    var url = `/admin/api/login?email=${email}&password=${password}`;

    return await HTTP.post(url);
}

/**
 * 
 * @param {String} name 
 * @param {String} buyAmount 
 * @param {boolean} free 
 * @returns 
 */
export async function AddProduct(name, buyAmount, free, startTime,endTime) {
    var url = '/admin/api/product/add';
    let data = JSON.stringify(
        {  
            name: name,
            buyAmount: buyAmount,
            free: free,
            startTime: startTime,
            endTime: endTime
        }
    );
    return await HTTP.post(url, data);

}
/**
 * 
 * @param {long} productId 
 * @param {string} name 
 * @param {boolean} free 
 * @param {string} imageUrl 
 * @param {string} fromImageUrl 
 * @param {string} description 
 * @returns 
 */

export async function ADDSUBPRODUCT(productId, name, free, unitPrice, imageUrl, fromImageUrl, description) {
    const url = '/admin/api/product/subProduct/add';
    let data = JSON.stringify(
        {
            productId: productId,
            name: name,
            free: free,
            unitPrice: unitPrice,
            imageUrl: imageUrl,
            fromImgUrl: fromImageUrl,
            description: description
        }
    );
    return await HTTP.post(url, data);
}

/**
 * 
 * @param {Number} pageSize 
 * @param {Number} pageNo 
 * @returns 
 */
export async function PRODUCT_LIST(pageSize, pageNo) {
    var url = `/admin/api/product/main-product/list?pageNo=${pageNo}&pageSize=${pageSize}`;
    
    return await HTTP.get(url);
}
/**
 * 
 * @param {FormData} formData 
 * @returns 
 */
export async function UPLOADFILE(formData) {
    var url = '/admin/api/sys/upload';

    return await HTTP.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

/**
 * 
 * @param {Number} pageSize 
 * @param {Number} pageNo 
 * @returns 
 */
export async function REALNAMEREQUEST(pageSize,pageNo) {
    let url = `/admin/api/realName-request?pageNo=${pageNo}&pageSize=${pageSize}`;

    return await HTTP.get(url);
}

/**
 * 
 * @param {Number} memberId 
 * @param {Number} status 
 * @returns 
 */
export async function REALNAMEAUTH(memberId, status) {
    let url = `/admin/api/realName/auth?memberId=${memberId}&status=${status}`

    return await HTTP.post(url);
}
/**
 * 
 * @param {Number} pageSize 
 * @param {Number} pageNo 
 * @returns 
 */
export async function ORDERLIST(pageSize, pageNo, status,name) {
    // debugger
    let url = `/admin/api/product-record/list?pageNo=${pageNo}&pageSize=${pageSize}&status=${status}&name=${name}`;
   

    return await HTTP.get(url);
}
/**
 * 
 * @param {Number} productRecordId 
 * @param {Number} status 
 * @returns 
 */
export async function UPDATEORDERSTATUS(status,productRecordId,memberId) {
    let url = `/admin/api/order/auth?status=${status}&productRecordId=${productRecordId}&memberId=${memberId}`;

    return await HTTP.put(url);
}
/**
 * 
 * @param {string} name 
 * @returns 
 */
export async function SEARCHPRODUCT(name) {
    let url = `/admin/api/product/search?name=${name}`
    
    return await HTTP.get(url);
}
/**
 * 
 * @param {string} name 
 * @returns 
 */
export async function SEARCHORDER(name,pageSize,pageNo) {
    let url = `/admin/api/order/search?name=${name}&pageNo=${pageNo}&pageSize=${pageSize}`;
    
    return await HTTP.post(url);
}
/**
 * 
 * @param {number} productId 
 * @returns 
 */
export async function DELETEPRODUCT(productId) {
    let url = `/admin/api/product/delete?productId=${productId}`;
    return await HTTP.delete(url);
}
/**
 * 
 * @param {Number} productId 
 * @returns 
 */
export async function SUBPRODUCTLIST(productId,pageNo,pageSize) {
    let url = `/admin/api/sub-product/list?productId=${productId}&pageNo=${pageNo}&pageSize=${pageSize}`
    return await HTTP.get(url);
}
/**
 * 
 * @param {Number} pageNo 
 * @param {Number} pageSize 
 * @returns 
 */
export async function WITHDRAWLIST(pageSize,pageNo) {
    let url = `/admin/api/withdraw/list?pageNo=${pageNo}&pageSize=${pageSize}`;
    return await HTTP.get(url);
}
/**
 * 
 * @param {Number} recordId 
 * @param {string} opt 
 * @param {Number} status 
 * @param {string} reason 
 * @returns 
 */
export async function UPDATEWITHDRAWSTATUS(recordId,opt,status,reason) {
    let url = `/admin/api/withdraw/auth?recordId=${recordId}&oneTimePassword=${opt}&status=${status}&reason=${reason}`;
    return await HTTP.put(url);
}
/**
 * 
 * @param {Number} id 
 * @param {Number} minAmount 
 * @param {Number} maxAmount 
 * @param {Number} fee 
 * @returns 
 */
export async function SETWITHDRAWFEE(id, minAmount, maxAmount, fee) {
    let url = `/admin/api/withdraw/update?withdrawId=${id}&minAmount=${minAmount}&maxAmount=${maxAmount}&fee=${fee}`;

    return await HTTP.put(url);
}
/**
 * 
 * @param {Number} status 
 * @param {Number} pageNo 
 * @param {Number} pageSize 
 * @returns 
 */
export async function FILTER_ORDER_STATUS(status, pageNo, pageSize) {
    let url = `/admin/api/order/filterStatus?status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;

    return await HTTP.get(url);
}
/**
 * 
 * @param {Number} subId 
 * @returns 
 */
export async function DELETE_SUB(subId) {
    let url = `/admin/api/sub-product/delete?subId=${subId}`;

    return await HTTP.delete(url);
}

/**
 * 
 * @param {Number} pageNo 
 * @param {Number} pageSize 
 * @returns 
 */
export async function MEMBER_LIST(pageNo, pageSize) {
    let url = `/admin/api/list?pageNo=${pageNo}&pageSize=${pageSize}`;

    return await HTTP.get(url);
}
/**
 * 
 * @param {String} name 
 * @param {Number} pageNo 
 * @param {Number} pageSize 
 * @returns 
 */
export async function SEARCH_MEMBER(name, pageNo, pageSize) {
    let url = `/admin/api/search?name=${name}&pageNo=${pageNo}&pageSize=${pageSize}`;

    return await HTTP.get(url);
}

/**
 * 
 * @param {String} email 
 * @param {String} description 
 * @param {String} imageLink 
 * @param {String} imageUrl 
 * @returns 
 */
export async function ADD_HONOR(email, description, imageLink, imageUrl) {
    let url = `/admin/api/honor/add?email=${email}&description=${description}&imageLink=${imageLink}&imageUrl=${imageUrl}`;

    return await HTTP.post(url);
}
/**
 * 
 * @param {Number} pageNo 
 * @param {Number} pageSize 
 * @returns 
 */
export async function HONOR_LIST(pageNo, pageSize) {
    let url = `/admin/api/honor/list?pageNo=${pageNo}&pageSize=${pageSize}`;

    return await HTTP.get(url)
}
/**
 * 
 * @param {String} value 
 * @returns 
 */

export async function BANNER_ADD(values) {
    let url = `/admin/api/banner/add`;
    let data = JSON.stringify({
        imageUrl: values.imageUrl
        
    })

    return await HTTP.post(url, data);
}

export async function BANNER_LIST() {
    let url = '/admin/api/banner/list';

    return await HTTP.get(url);
}
/**
 * 
 * @param {Number} id 
 * @returns 
 */
export async function DELETE_BANNER(id) {
    let url = `/admin/api/banner/delete?id=${id}`
    
    return await HTTP.delete(url);
}

/**
 * 
 * @param {String} title 
 * @returns 
 */
export async function ADD_GUIDE(title) {
    let url = `/admin/api/guide/add?title=${title}`
    
    return await HTTP.post(url);
}

export async function GUIDE_LIST(pageNo, pageSize) {
    let url =`/admin/api/guide/list?pageNo=${pageNo}&pageSize=${pageSize}`
    
    return await HTTP.get(url);
}

export async function DELETE_GUIDE(id) {
    let url = `/admin/api/guide/delete?id=${id}`
    
    return await HTTP.delete(url);
}
/**
 * 
 * @param {Number} guideId 
 * @param {String} title 
 * @param {String} description 
 * @returns 
 */
export async function ADD_SUB_GUIDE(guideId, title, description, videoUrl) {
    let url = `/admin/api/guide/sub/add?guideId=${guideId}&title=${title}&description=${description}&videoUrl=${videoUrl}`

    return await HTTP.post(url);
}
/**
 * 
 * @param {Number} guideId 
 * @returns 
 */
export async function SUB_GUIDE_LIST(guideId) {
    let url = `/admin/api/guide/sub/list?id=${guideId}`

    return await HTTP.get(url);
}
/**
 * 
 * @param {Number} id 
 * @returns 
 */
export async function DELETE_SUB_GUIDE(id) {
    let url = `/admin/api/guide/sub/delete?id=${id}`;
    
    return await HTTP.delete(url);
}

/**
 * 
 * @param {Number} id 
 * @param {string} description 
 * @param {string} title 
 * @returns 
 */
export async function EDIT_SUB_GUIDE(id, title, description) {
    let url =`/admin/api/guide/sub/edit?id=${id}&title=${title}&description=${description}`

    return await HTTP.put(url);
}
/**
 * 
 * @param {JSON} data 
 * @returns 
 */
export async function APP_RELEASE(data) {
    const url = '/admin/api/app/version/add';
    let appData = JSON.stringify({
        platform: data.platform,
        name: data.name,
        version: data.version,
        link: data.uploadLink,
        description: data.description
    })

    return await HTTP.post(url, appData);
}
/**
 * 
 * @param {JSON} data 
 * @returns 
 */
export async function APP_UPDATE(data) {
    const url = '/admin/api/app/version/update';
    let appData = JSON.stringify({
        id: data.id,
        platform: data.platform,
        name: data.name,
        version: data.version,
        link: data.link,
        description: data.description
    })

    return await HTTP.put(url, appData);
}


export async function APP_VERSION() {
    let url = '/admin/api/app/version/list';

    return await HTTP.get(url);
}

export async function EDIT_PRODUCT(id,name,buyAmount,free,startTime,endTime) {
    let url = `admin/api/product/update`;
    let data = JSON.stringify(
        {    
            id: id,
            name: name,
            buyAmount: buyAmount,
            free: free,
            startTime: startTime,
            endTime: endTime

        }
    )
    return await HTTP.put(url, data);
}


export async function BANK_LIST() {
    let url = `/admin/api/bank/list`
    
    return await HTTP.get(url);
}
/**
 * 
 * @param {Object} values 
 * @returns 
 */
export async function ADD_BANK(values) {
    let url = '/admin/api/bank/add';
    let data = JSON.stringify({
        name: values.name,
        accountName: values.bankAccName,
        accountNo: values.bankAccNo,
        branchName: values.branchName,
        bankVersion: values.version
    })

    return await HTTP.post(url, data);
}

export async function EDIT_BANK(id, values) {
    let url = '/admin/api/bank/update';
    let data = JSON.stringify({
        id: id,
        name: values.name,
        accountName: values.bankAccName,
        accountNo: values.bankAccNo,
        branchName: values.branchName,
        bankVersion: values.version
    })
    return await HTTP.put(url, data);
}


export async function EDIT_SUB_PRODUCT(id,values) {
    let url = '/admin/api/sub-product/update';
    let data = JSON.stringify({
        id: id,
        name: values.name,
        unitPrice: values.unitPrice,
        free: values.free,
        fromImgUrl: values.fromImgUrl,
        imageUrl: values.imageUrl ,
        description: values.description 
    })
    return await HTTP.put(url, data);
}