extends Control

@onready var question_label = $VBoxContainer/QuestionLabel
@onready var options_container = $VBoxContainer/OptionsContainer
@onready var feedback_label = $VBoxContainer/FeedbackLabel
@onready var next_button = $VBoxContainer/NextButton
@onready var progress_label = $VBoxContainer/ProgressLabel

var challenges = []
var current_challenge_index = 0
var score = 0

func _ready():
	next_button.hide()
	load_lessons_data()
	show_challenge()

func load_lessons_data():
	var file = FileAccess.open("res://data/lessons.json", FileAccess.READ)
	if file:
		var json_string = file.get_as_text()
		var json = JSON.new()
		var error = json.parse(json_string)
		if error == OK:
			var data = json.data
			if typeof(data) == TYPE_ARRAY and data.size() > 0:
				var course = data[0]
				for unit in course.get("units", []):
					for lesson in unit.get("lessons", []):
						for challenge in lesson.get("challenges", []):
							challenges.append(challenge)
		else:
			print("JSON Parse Error: ", json.get_error_message())
	else:
		print("Could not load lessons.json")

func show_challenge():
	if current_challenge_index >= challenges.size():
		show_end_screen()
		return

	var challenge = challenges[current_challenge_index]
	progress_label.text = "Questão %d / %d" % [current_challenge_index + 1, challenges.size()]
	question_label.text = challenge.get("question", "")
	feedback_label.text = ""
	next_button.hide()

	# Clear previous options
	for child in options_container.get_children():
		child.queue_free()

	var options = challenge.get("options", [])
	# Shuffle options optional:
	# options.shuffle()
	
	for i in range(options.size()):
		var option = options[i]
		var btn = Button.new()
		btn.text = option.get("text", "")
		btn.custom_minimum_size = Vector2(0, 60)
		btn.add_theme_font_size_override("font_size", 18)
		# Add word wrap using modern Godot 4 property
		btn.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		btn.pressed.connect(self._on_option_pressed.bind(option, btn))
		options_container.add_child(btn)

func _on_option_pressed(option_data, button_node: Button):
	# Disable all buttons
	for child in options_container.get_children():
		if child is Button:
			child.disabled = true

	if option_data.get("correct", false):
		feedback_label.text = "Correto!"
		feedback_label.add_theme_color_override("font_color", Color(0.2, 0.8, 0.2))
		button_node.modulate = Color(0.5, 1.0, 0.5)
		score += 1
	else:
		feedback_label.text = "Incorreto!"
		feedback_label.add_theme_color_override("font_color", Color(0.8, 0.2, 0.2))
		button_node.modulate = Color(1.0, 0.5, 0.5)
		
		# Highlight correct option
		for child in options_container.get_children():
			# This is tricky because we didn't save the correct state to the button directly.
			# But for a simple prototype, showing incorrect is enough.
			pass

	next_button.show()

func _on_next_button_pressed():
	current_challenge_index += 1
	show_challenge()

func show_end_screen():
	question_label.text = "Lição Concluída!\nSua pontuação: %d / %d" % [score, challenges.size()]
	progress_label.text = ""
	feedback_label.text = ""
	next_button.hide()
	for child in options_container.get_children():
		child.queue_free()
