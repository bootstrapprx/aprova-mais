extends Node

enum State { MENU, LOADING, WORLD, BUILDING, GRAPH, CHALLENGE, RESULT, PAUSED }

var current_state: State = State.MENU
var previous_state: State = State.MENU

var current_course_id: int = -1
var current_course_data: Dictionary = {}
var current_challenge_index: int = 0
var session_score: int = 0
var session_total: int = 0
var session_correct_count: int = 0

signal state_changed(old_state: State, new_state: State)
signal course_loaded(course: Dictionary)
signal session_finished(score: int, total: int)

func _ready():
	process_mode = Node.PROCESS_MODE_ALWAYS

func change_state(new_state: State) -> void:
	if new_state == current_state:
		return
	previous_state = current_state
	current_state = new_state
	state_changed.emit(previous_state, current_state)

func start_course(course_id: int) -> void:
	current_course_id = course_id
	current_course_data = DataManager.get_course(course_id)
	if current_course_data.is_empty():
		push_error("Course not found: %d" % course_id)
		return
	current_challenge_index = 0
	session_score = 0
	session_correct_count = 0
	_count_session_total()
	course_loaded.emit(current_course_data)
	change_state(State.LOADING)

func _count_session_total() -> void:
	session_total = 0
	for unit in current_course_data.get("units", []):
		for lesson in unit.get("lessons", []):
			session_total += lesson.get("challenges", []).size()

func get_current_challenge() -> Dictionary:
	var idx = 0
	for unit in current_course_data.get("units", []):
		for lesson in unit.get("lessons", []):
			for challenge in lesson.get("challenges", []):
				if idx == current_challenge_index:
					return challenge
				idx += 1
	return {}

func get_all_challenges() -> Array:
	var all: Array = []
	for unit in current_course_data.get("units", []):
		for lesson in unit.get("lessons", []):
			for challenge in lesson.get("challenges", []):
				all.append(challenge)
	return all

func report_challenge_result(correct: bool) -> void:
	if correct:
		session_correct_count += 1
		session_score += 1

func next_challenge() -> void:
	current_challenge_index += 1
	if current_challenge_index >= session_total:
		change_state(State.RESULT)
	else:
		change_state(State.CHALLENGE)

func finish_session() -> void:
	session_finished.emit(session_score, session_total)
	change_state(State.MENU)

func restart_session() -> void:
	start_course(current_course_id)

func go_back() -> void:
	change_state(previous_state)
