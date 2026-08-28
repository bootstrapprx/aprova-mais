extends Node3D

@onready var screen_label: Label3D = $ScreenLabel
@onready var support_label: Label3D = $SupportTextLabel
@onready var options_container: Node3D = $OptionsContainer
@onready var feedback_particles: GPUParticles3D = $FeedbackParticles
@onready var feedback_label: Label = $HUD/FeedbackLabel
@onready var progress_label: Label = $HUD/TopBar/ProgressLabel
@onready var xp_label: Label = $HUD/TopBar/XPLabel
@onready var level_label: Label = $HUD/TopBar/LevelLabel

var challenge_data: Dictionary = {}
var option_buttons: Array[Node3D] = []
var is_answered: bool = false
var option_correct_map: Array[bool] = []

signal challenge_completed(correct: bool, xp_earned: int)

const OPTION_POSITIONS := [
	Vector3(-1.5, 0.4, 1.5),
	Vector3(1.5, 0.4, 1.5),
	Vector3(-1.5, 0.4, 3.0),
	Vector3(1.5, 0.4, 3.0),
]

const CORRECT_COLOR := Color(0.15, 0.75, 0.25, 1)
const INCORRECT_COLOR := Color(0.85, 0.2, 0.2, 1)
const DEFAULT_COLOR := Color(0.2, 0.4, 0.7, 1)
const HIGHLIGHT_COLOR := Color(0.9, 0.75, 0.1, 1)

func setup(data: Dictionary) -> void:
	challenge_data = data
	is_answered = false
	feedback_label.text = ""
	feedback_label.modulate = Color.WHITE
	_update_hud()
	_render_question()
	_render_options()

func _update_hud() -> void:
	progress_label.text = "%d / %d" % [GameManager.current_challenge_index + 1, GameManager.session_total]
	xp_label.text = "XP: %d" % XPManager.xp
	level_label.text = "Nível %d" % XPManager.level

func _render_question() -> void:
	screen_label.text = challenge_data.get("question", "...")
	var support_text = challenge_data.get("textoApoio", null)
	if support_text and str(support_text).length() > 0:
		support_label.text = "[ " + str(support_text) + " ]"
	else:
		support_label.text = ""

func _render_options() -> void:
	for child in option_buttons:
		child.queue_free()
	option_buttons.clear()
	option_correct_map.clear()

	var options = challenge_data.get("options", [])
	var option_count := min(options.size(), 4)

	for i in option_count:
		var option = options[i]
		var btn := _create_option(i, option)
		options_container.add_child(btn)
		option_buttons.append(btn)
		option_correct_map.append(option.get("correct", false))

	for i in range(option_count, 4):
		var empty = option_buttons[i] if i < option_buttons.size() else null
		if empty:
			empty.hide()

func _create_option(index: int, option: Dictionary) -> Node3D:
	var node := Node3D.new()
	node.position = OPTION_POSITIONS[index]
	node.name = "Option_%d" % index

	var platform := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = Vector3(1.2, 0.15, 0.6)
	platform.mesh = box
	platform.position.y = 0.0
	var mat := StandardMaterial3D.new()
	mat.albedo_color = DEFAULT_COLOR
	mat.emission_enabled = true
	mat.emission = Color(0.05, 0.1, 0.2, 1)
	mat.emission_energy_multiplier = 0.2
	platform.material_override = mat
	platform.name = "Platform"
	node.add_child(platform)

	var label := Label3D.new()
	label.text = option.get("text", "")
	label.position = Vector3(0, 0.35, 0)
	label.font_size = 20
	label.width = 1.1
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.modulate = Color(0.9, 0.92, 0.95, 1)
	node.add_child(label)

	var area := Area3D.new()
	area.name = "Area3D"
	area.input_event.connect(func(_cam: Camera3D, event: InputEvent, _pos: Vector3, _norm: Vector3, _idx: int):
		if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			_on_option_clicked(index)
	)
	var col := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = Vector3(1.2, 0.6, 0.6)
	col.shape = shape
	area.add_child(col)
	node.add_child(area)

	node.set_meta("index", index)
	return node

func _on_option_clicked(index: int) -> void:
	if is_answered:
		return
	is_answered = true

	var correct := option_correct_map[index]

	_highlight_options(index, correct)

	if correct:
		feedback_label.text = "Correto!"
		feedback_label.modulate = CORRECT_COLOR
		feedback_particles.modulate = Color(1, 0.9, 0.2, 1)
		_spawn_feedback_particles()
		XPManager.add_challenge_xp(true)
		AudioManager.play_sfx("correct")
	else:
		feedback_label.text = "Incorreto!"
		feedback_label.modulate = INCORRECT_COLOR
		feedback_particles.modulate = Color(0.9, 0.2, 0.2, 1)
		_spawn_feedback_particles()
		XPManager.add_challenge_xp(false)
		AudioManager.play_sfx("incorrect")

	challenge_completed.emit(correct, XPManager.XP_PER_CHALLENGE_CORRECT if correct else XPManager.XP_PER_CHALLENGE_INCORRECT)

func _highlight_options(selected_index: int, was_correct: bool) -> void:
	for i in option_buttons.size():
		var btn = option_buttons[i]
		var platform = btn.get_node_or_null("Platform")
		if not platform:
			continue
		var mat = StandardMaterial3D.new()
		mat.emission_enabled = true
		mat.emission_energy_multiplier = 0.2
		if i == selected_index:
			mat.albedo_color = CORRECT_COLOR if was_correct else INCORRECT_COLOR
			mat.emission = CORRECT_COLOR if was_correct else INCORRECT_COLOR
		elif option_correct_map[i]:
			mat.albedo_color = HIGHLIGHT_COLOR
			mat.emission = HIGHLIGHT_COLOR
		else:
			mat.albedo_color = Color(0.3, 0.3, 0.3, 1)
			mat.emission = Color(0.05, 0.05, 0.05, 1)
		platform.material_override = mat

func _spawn_feedback_particles() -> void:
	feedback_particles.restart()
	feedback_particles.emitting = true
