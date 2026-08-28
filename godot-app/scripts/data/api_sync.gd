extends Node

var base_url: String = "http://localhost:3000"
var auth_token: String = ""
var user_id: String = ""
var http_request: HTTPRequest

const AUTH_PATH = "user://auth_token.json"

signal courses_fetched(courses: Array)
signal map_fetched(map_data: Dictionary)
signal progress_synced(ok: bool)
signal auth_completed(success: bool)

func _ready():
	http_request = HTTPRequest.new()
	add_child(http_request)
	_load_saved_auth()

func _load_saved_auth() -> void:
	if FileAccess.file_exists(AUTH_PATH):
		var file = FileAccess.open(AUTH_PATH, FileAccess.READ)
		if file:
			var json = JSON.new()
			if json.parse(file.get_as_text()) == OK:
				var data = json.data
				auth_token = data.get("token", "")
				user_id = data.get("user_id", "")

func _save_auth() -> void:
	var file = FileAccess.open(AUTH_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify({"token": auth_token, "user_id": user_id}))

func _headers() -> PackedStringArray:
	var headers := PackedStringArray()
	if not auth_token.is_empty():
		headers.append("Authorization: Bearer " + auth_token)
	headers.append("Content-Type: application/json")
	return headers

func is_authenticated() -> bool:
	return not auth_token.is_empty()

func authenticate(email: String, password: String) -> void:
	var url := base_url + "/api/sync/auth"
	var body = JSON.stringify({"email": email, "password": password})
	var headers := PackedStringArray(["Content-Type: application/json"])
	http_request.request_completed.connect(_on_auth_completed, CONNECT_ONE_SHOT)
	http_request.request(url, headers, HTTPClient.METHOD_POST, body)

func _on_auth_completed(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		push_error("Auth failed: code %d" % response_code)
		auth_completed.emit(false)
		return
	var json = JSON.new()
	if json.parse(body.get_string_from_utf8()) != OK:
		push_error("Auth response parse error")
		auth_completed.emit(false)
		return
	var data = json.data
	auth_token = data.get("token", "")
	user_id = data.get("user_id", "")
	_save_auth()
	auth_completed.emit(true)

func fetch_courses() -> void:
	var url := base_url + "/api/sync/courses"
	http_request.request_completed.connect(_on_courses_completed, CONNECT_ONE_SHOT)
	http_request.request(url, _headers())

func _on_courses_completed(result: int, response_code: int, _h: PackedStringArray, body: PackedByteArray) -> void:
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		push_error("Fetch courses failed: code %d" % response_code)
		courses_fetched.emit([])
		return
	var json = JSON.new()
	if json.parse(body.get_string_from_utf8()) == OK:
		courses_fetched.emit(json.data if typeof(json.data) == TYPE_ARRAY else [])
	else:
		courses_fetched.emit([])

func fetch_map(course_id: int) -> void:
	var url := base_url + "/api/sync/map/%d" % course_id
	http_request.request_completed.connect(_on_map_completed, CONNECT_ONE_SHOT)
	http_request.request(url, _headers())

func _on_map_completed(result: int, response_code: int, _h: PackedStringArray, body: PackedByteArray) -> void:
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		push_error("Fetch map failed: code %d" % response_code)
		map_fetched.emit({})
		return
	var json = JSON.new()
	if json.parse(body.get_string_from_utf8()) == OK:
		map_fetched.emit(json.data if typeof(json.data) == TYPE_DICTIONARY else {})
	else:
		map_fetched.emit({})

func post_progress(challenge_id: int, completed: bool) -> void:
	var url := base_url + "/api/sync/progress"
	var body = JSON.stringify({"challengeId": challenge_id, "completed": completed})
	http_request.request_completed.connect(_on_progress_posted, CONNECT_ONE_SHOT)
	http_request.request(url, _headers(), HTTPClient.METHOD_POST, body)

func _on_progress_posted(result: int, response_code: int, _h: PackedStringArray, _body: PackedByteArray) -> void:
	progress_synced.emit(result == HTTPRequest.RESULT_SUCCESS and response_code == 200)

func fetch_progress() -> void:
	var url := base_url + "/api/sync/progress"
	http_request.request_completed.connect(_on_progress_fetched, CONNECT_ONE_SHOT)
	http_request.request(url, _headers())

func _on_progress_fetched(result: int, response_code: int, _h: PackedStringArray, body: PackedByteArray) -> void:
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		progress_synced.emit(false)
		return
	var json = JSON.new()
	if json.parse(body.get_string_from_utf8()) == OK:
		progress_synced.emit(true)
	else:
		progress_synced.emit(false)

func logout() -> void:
	auth_token = ""
	user_id = ""
	var dir = DirAccess.open("user://")
	if dir:
		dir.remove("auth_token.json")
