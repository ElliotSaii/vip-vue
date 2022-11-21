import moment from 'moment';
const rangeDate = {
    data() {
        return {
            ranges: {
                '昨天' : [moment().day(moment().day()-1),moment().day(moment().day() -1)],
                '今天' : [moment(),moment()],
                '上周' : [moment().week(moment().week()-1).startOf('week'),moment().week(moment().week()-1).endOf('week')],
                '本周' : [moment().weekday(0),moment().weekday(6)],
                '上月' : [moment().month(moment().month() -1).startOf('month'),moment().month(moment().month() -1).endOf('month')],
                '本月' : [moment().startOf('month'),moment().endOf('month')],
                '上季度' : [moment().quarter(moment().quarter() -1).startOf('quarter'), moment().quarter(moment().quarter() -1).endOf('quarter')],
                '本季度' : [moment().startOf('quarter'), moment().endOf('quarter')],
                '去年' : [moment().year(moment().year() -1).startOf('year'), moment().year(moment().year() -1).endOf('year')],
            }
        }
    },
    methods: {moment}
}
export {rangeDate}