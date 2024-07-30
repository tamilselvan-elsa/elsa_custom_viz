constant: vis_id {
  value: "treemap_vis"
  export: override_optional
}
constant: vis_label {
  value: "Treemap Visualization"
  export: override_optional
}
visualization: {
  id: "@{vis_id}"
  label: "@{vis_label}"
  file: "src/visualizations/custom/treemap/treemap.js"
  sri_hash: "my_sri_hash"
  dependencies: []
}
