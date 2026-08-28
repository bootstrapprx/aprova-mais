extends Node3D

@onready var nodes_container: Node3D = $NodesContainer
@onready var edges_container: Node3D = $EdgesContainer
@onready var camera: Camera3D = $Camera3D
@onready var hud: CanvasLayer = $HUD
@onready var title_label: Label = $HUD/TopBar/TitleLabel
@onready var back_button: Button = $HUD/TopBar/BackButton
@onready var xp_label: Label = $HUD/TopBar/XPLabel
@onready var level_label: Label = $HUD/TopBar/LevelLabel
@onready var info_panel: PanelContainer = $HUD/InfoPanel
@onready var info_title: Label = $HUD/InfoPanel/MarginContainer/VBox/InfoTitle
@onready var info_desc: Label = $HUD/InfoPanel/MarginContainer/VBox/InfoDesc
@onready var info_challenges: Label = $HUD/InfoPanel/MarginContainer/VBox/InfoChallenges
@onready var info_enter_button: Button = $HUD/InfoPanel/MarginContainer/VBox/EnterButton

var course_data: Dictionary = {}
var graph_nodes: Array[Node3D] = []
var edge_lines: Array[MeshInstance3D] = []
var selected_node_index: int = -1
var node_positions: Array[Vector2] = []

const NODE_RADIUS := 0.6
const NODE_SPACING_X := 4.0
const NODE_SPACING_Y := 3.5
const EDGE_THICKNESS := 0.05

const COLOR_COMPLETED := Color(0.15, 0.75, 0.3)
const COLOR_CURRENT := Color(0.95, 0.8, 0.15)
const COLOR_LOCKED := Color(0.4, 0.45, 0.55)
const COLOR_UNIT := Color(0.25, 0.45, 0.75)
const COLOR_EDGE := Color(0.35, 0.38, 0.42)

signal node_selected(unit_index: int, lesson_index: int)

func _ready():
	back_button.pressed.connect(_on_back_pressed)
	info_enter_button.pressed.connect(_on_enter_pressed)
	node_selected.connect(_on_node_selected)
	info_panel.hide()

func setup(course: Dictionary) -> void:
	course_data = course
	_clear_graph()
	_calculate_layout()
	_build_nodes()
	_build_edges()
	title_label.text = course.get("title", "Curso") + " — Grafo"
	_update_hud()

func _calculate_layout() -> void:
	node_positions.clear()
	var units = course_data.get("units", [])
	var y_offset := 0.0

	for unit_idx in units.size():
		var unit = units[unit_idx]
		var lessons = unit.get("lessons", [])
		var unit_x := 0.0
		var unit_y := -y_offset

		node_positions.append(Vector2(unit_x, unit_y))

		for lesson_idx in lessons.size():
			var lesson_x = unit_x + (lesson_idx + 1) * NODE_SPACING_X
			var lesson_y = unit_y - NODE_SPACING_Y * 0.5
			node_positions.append(Vector2(lesson_x, lesson_y))

		y_offset += NODE_SPACING_Y * (1.0 + lessons.size() * 0.3)

func _build_nodes() -> void:
	var units = course_data.get("units", [])
	var global_idx := 0

	for unit_idx in units.size():
		var unit = units[unit_idx]
		var pos2d = node_positions[global_idx]
		var node := _create_unit_node(global_idx, unit_idx, unit, Vector3(pos2d.x, 0, pos2d.y))
		nodes_container.add_child(node)
		graph_nodes.append(node)
		global_idx += 1

		var lessons = unit.get("lessons", [])
		for lesson_idx in lessons.size():
			var lesson = lessons[lesson_idx]
			pos2d = node_positions[global_idx]
			var lnode := _create_lesson_node(global_idx, unit_idx, lesson_idx, lesson, Vector3(pos2d.x, 0, pos2d.y))
			nodes_container.add_child(lnode)
			graph_nodes.append(lnode)
			global_idx += 1

func _create_unit_node(index: int, unit_idx: int, unit: Dictionary, pos: Vector3) -> Node3D:
	var node := Node3D.new()
	node.position = pos
	node.name = "UnitNode_%d" % index

	var mesh_inst := MeshInstance3D.new()
	var sphere := SphereMesh.new()
	sphere.radius = NODE_RADIUS * 1.3
	sphere.height = NODE_RADIUS * 2.6
	mesh_inst.mesh = sphere
	mesh_inst.position.y = NODE_RADIUS * 1.3
	var mat := StandardMaterial3D.new()
	mat.albedo_color = COLOR_UNIT
	mat.emission_enabled = true
	mat.emission = COLOR_UNIT * 0.2
	mat.emission_energy_multiplier = 0.3
	mesh_inst.material_override = mat
	mesh_inst.name = "Mesh"
	node.add_child(mesh_inst)

	var label := Label3D.new()
	label.text = unit.get("title", "?")
	label.position = Vector3(0, NODE_RADIUS * 2.8, 0)
	label.font_size = 18
	label.width = 2.5
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.modulate = Color(1, 1, 1, 1)
	node.add_child(label)

	var area := Area3D.new()
	var col := CollisionShape3D.new()
	var shape := SphereShape3D.new()
	shape.radius = NODE_RADIUS * 1.5
	col.shape = shape
	area.add_child(col)
	area.input_event.connect(func(_cam, event, _pos, _norm, _idx):
		if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			_select_node(index)
	)
	node.add_child(area)

	node.set_meta("type", "unit")
	node.set_meta("index", index)
	node.set_meta("unit_index", unit_idx)
	return node

func _create_lesson_node(index: int, unit_idx: int, lesson_idx: int, lesson: Dictionary, pos: Vector3) -> Node3D:
	var node := Node3D.new()
	node.position = pos
	node.name = "LessonNode_%d" % index

	var completed = _is_lesson_completed(unit_idx, lesson_idx)
	var is_current = _is_lesson_current(unit_idx, lesson_idx)

	var color: Color
	if completed:
		color = COLOR_COMPLETED
	elif is_current:
		color = COLOR_CURRENT
	else:
		color = COLOR_LOCKED

	var mesh_inst := MeshInstance3D.new()
	var cylinder := CylinderMesh.new()
	cylinder.top_radius = NODE_RADIUS
	cylinder.bottom_radius = NODE_RADIUS
	cylinder.height = NODE_RADIUS * 2.0
	mesh_inst.mesh = cylinder
	mesh_inst.position.y = NODE_RADIUS
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.emission_enabled = true
	mat.emission = color * 0.15
	mat.emission_energy_multiplier = 0.3
	mesh_inst.material_override = mat
	mesh_inst.name = "Mesh"
	node.add_child(mesh_inst)

	var label := Label3D.new()
	label.text = lesson.get("title", "?")
	label.position = Vector3(0, NODE_RADIUS * 2.5, 0)
	label.font_size = 14
	label.width = 2.0
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.modulate = Color(0.95, 0.95, 0.97, 1)
	node.add_child(label)

	var count = lesson.get("challenges", []).size()
	var badge := Label3D.new()
	if completed:
		badge.text = "✓ %d questões" % count
		badge.modulate = COLOR_COMPLETED
	elif is_current:
		badge.text = "%d questões" % count
		badge.modulate = COLOR_CURRENT
	else:
		badge.text = "%d questões" % count
		badge.modulate = Color(0.55, 0.58, 0.62)
	badge.position = Vector3(0, -0.3, 0)
	badge.font_size = 12
	node.add_child(badge)

	var area := Area3D.new()
	var col := CollisionShape3D.new()
	var shape := CylinderShape3D.new()
	shape.radius = NODE_RADIUS * 1.2
	shape.height = NODE_RADIUS * 2.5
	col.shape = shape
	area.add_child(col)
	area.input_event.connect(func(_cam, event, _pos, _norm, _idx):
		if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			_select_node(index)
	)
	node.add_child(area)

	node.set_meta("type", "lesson")
	node.set_meta("index", index)
	node.set_meta("unit_index", unit_idx)
	node.set_meta("lesson_index", lesson_idx)
	node.set_meta("lesson_data", lesson)
	return node

func _build_edges() -> void:
	var units = course_data.get("units", [])
	var global_idx := 0

	for unit_idx in units.size():
		var unit = units[unit_idx]
		var unit_pos = node_positions[global_idx]
		global_idx += 1

		var lessons = unit.get("lessons", [])
		for lesson_idx in lessons.size():
			var lesson_pos = node_positions[global_idx]
			_create_edge(unit_pos, lesson_pos)
			global_idx += 1

func _create_edge(from: Vector2, to: Vector2) -> void:
	var from3 := Vector3(from.x, 0, from.y)
	var to3 := Vector3(to.x, 0, to.y)
	var mid := (from3 + to3) * 0.5
	var diff := to3 - from3
	var length := diff.length()
	var direction := diff.normalized()

	var mesh_inst := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = Vector3(EDGE_THICKNESS, EDGE_THICKNESS, length)
	mesh_inst.mesh = box
	mesh_inst.position = mid + Vector3(0, 0.1, 0)

	var angle := atan2(direction.x, direction.z)
	mesh_inst.rotation.y = angle

	var mat := StandardMaterial3D.new()
	mat.albedo_color = COLOR_EDGE
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mat.albedo_color.a = 0.6
	mesh_inst.material_override = mat
	edges_container.add_child(mesh_inst)
	edge_lines.append(mesh_inst)

func _select_node(index: int) -> void:
	selected_node_index = index
	if index < 0 or index >= graph_nodes.size():
		info_panel.hide()
		return

	var node = graph_nodes[index]
	var type = node.get_meta("type", "")

	if type == "unit":
		info_panel.hide()
		return

	var lesson_data = node.get_meta("lesson_data", {})
	var unit_idx = node.get_meta("unit_index", 0)
	var lesson_idx = node.get_meta("lesson_index", 0)

	info_title.text = lesson_data.get("title", "?")
	info_desc.text = "Unidade: %s" % course_data.get("units", [])[unit_idx].get("title", "?")
	var count = lesson_data.get("challenges", []).size()
	info_challenges.text = "%d questões" % count

	if _is_lesson_completed(unit_idx, lesson_idx):
		info_enter_button.text = "Revisar"
	else:
		info_enter_button.text = "Iniciar"

	info_panel.show()

func _on_enter_pressed() -> void:
	if selected_node_index < 0 or selected_node_index >= graph_nodes.size():
		return
	var node = graph_nodes[selected_node_index]
	if node.get_meta("type", "") != "lesson":
		return

	var unit_idx = node.get_meta("unit_index", 0)
	var lesson_idx = node.get_meta("lesson_index", 0)
	node_selected.emit(unit_idx, lesson_idx)

func _on_node_selected(unit_idx: int, lesson_idx: int) -> void:
	var units = course_data.get("units", [])
	if unit_idx >= units.size():
		return
	var lessons = units[unit_idx].get("lessons", [])
	if lesson_idx >= lessons.size():
		return
	var challenges = lessons[lesson_idx].get("challenges", [])
	if challenges.is_empty():
		return

	var main = get_parent()
	if main.has_method("enter_challenge_from_graph"):
		main.enter_challenge_from_graph(challenges, 0, unit_idx, lesson_idx)

func _is_lesson_completed(unit_idx: int, lesson_idx: int) -> bool:
	var progress = DataManager.load_progress()
	var completed: Array = progress.get("completed_lessons", [])
	var units = course_data.get("units", [])
	if unit_idx >= units.size():
		return false
	var lessons = units[unit_idx].get("lessons", [])
	if lesson_idx >= lessons.size():
		return false
	var lesson_id = lessons[lesson_idx].get("id", -1)
	return lesson_id in completed

func _is_lesson_current(unit_idx: int, lesson_idx: int) -> bool:
	if _is_lesson_completed(unit_idx, lesson_idx):
		return false
	return true

func _on_back_pressed() -> void:
	info_panel.hide()
	GameManager.change_state(GameManager.State.MENU)

func _update_hud() -> void:
	xp_label.text = "XP: %d" % XPManager.xp
	level_label.text = "Nível %d" % XPManager.level

func _clear_graph() -> void:
	for child in nodes_container.get_children():
		child.queue_free()
	for child in edges_container.get_children():
		child.queue_free()
	graph_nodes.clear()
	edge_lines.clear()
	node_positions.clear()
	selected_node_index = -1
	info_panel.hide()
