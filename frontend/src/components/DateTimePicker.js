const DateTimePicker = (pops) => {
  return (
    <div className="form-outline datetimepicker" data-mdb-inline="true">
      <input type="text" className="form-control" id="datetimepickerInline" />
      <label htmlFor="datetimepickerInline" className="form-label">
        Select Date and Time
      </label>
    </div>
  );
};

export default DateTimePicker;
