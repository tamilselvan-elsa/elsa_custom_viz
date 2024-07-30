view: your_view {
  sql_table_name: your_table_name ;;

  dimension: your_dimension {
    sql: ${TABLE}.your_dimension ;;
  }

  measure: your_measure {
    type: sum
    sql: ${TABLE}.your_measure ;;
  }
}
