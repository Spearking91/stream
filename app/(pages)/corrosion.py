import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import serial
import pandas as pd
import threading
import time
import datetime
import os
import re
from pathlib import Path
import logging

class CorrosionMonitorGUI:
    def _init_(self, root):
        self.root = roota
        self.root.title("Corrosion Monitoring Data Logger")
        self.root.geometry("800x600")
        
        # Data storage
        self.data_buffer = []
        self.serial_connection = None
        self.logging_thread = None
        self.is_logging = False
        
        # Configuration
        self.port = tk.StringVar(value='COM3')
        self.baudrate = tk.IntVar(value=9600)
        self.excel_filename = tk.StringVar(value='corrosion_data.xlsx')
        self.thickness_interval = tk.IntVar(value=300)  # Default 5 minutes (300 seconds)
        
        # Thickness readings
        self.thickness_point1 = tk.DoubleVar()
        self.thickness_point2 = tk.DoubleVar()
        self.thickness_point3 = tk.DoubleVar()
        self.waiting_for_thickness = False
        
        # Status variables
        self.connection_status = tk.StringVar(value="Disconnected")
        self.logging_status = tk.StringVar(value="Stopped")
        self.records_count = tk.IntVar(value=0)
        
        # Setup logging
        self.setup_logging()
        
        # Create GUI
        self.create_gui()
        
        # Data parsing pattern for new format
        self.data_pattern = re.compile(
            r'DATA:timestamp=(\d+),temp=([-\d.]+),humidity=([-\d.]+),'
            r'magnetic=([-\d.]+),current=([-\d.]+),thickness1=([-\d.]+),'
            r'thickness2=([-\d.]+),thickness3=([-\d.]+),avg_thickness=([-\d.]+)'
        )
    
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('gui_logger.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(_name_)
    
    def create_gui(self):
        # Main notebook for tabs
        notebook = ttk.Notebook(self.root)
        notebook.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Connection Tab
        self.create_connection_tab(notebook)
        
        # Thickness Reading Tab
        self.create_thickness_tab(notebook)
        
        # Data Monitoring Tab
        self.create_monitoring_tab(notebook)
        
        # Status Bar
        self.create_status_bar()
    
    def create_connection_tab(self, parent):
        conn_frame = ttk.Frame(parent)
        parent.add(conn_frame, text="Connection & Settings")
        
        # Connection Settings
        settings_group = ttk.LabelFrame(conn_frame, text="Connection Settings", padding=10)
        settings_group.pack(fill='x', padx=10, pady=5)
        
        ttk.Label(settings_group, text="Serial Port:").grid(row=0, column=0, sticky='w', padx=5)
        port_combo = ttk.Combobox(settings_group, textvariable=self.port, width=10)
        port_combo['values'] = ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8']
        port_combo.grid(row=0, column=1, padx=5, sticky='w')
        
        ttk.Label(settings_group, text="Baudrate:").grid(row=0, column=2, sticky='w', padx=5)
        ttk.Entry(settings_group, textvariable=self.baudrate, width=10).grid(row=0, column=3, padx=5, sticky='w')
        
        ttk.Button(settings_group, text="Connect", command=self.connect_arduino).grid(row=0, column=4, padx=10)
        ttk.Button(settings_group, text="Disconnect", command=self.disconnect_arduino).grid(row=0, column=5, padx=5)
        
        # File Settings
        file_group = ttk.LabelFrame(conn_frame, text="File Settings", padding=10)
        file_group.pack(fill='x', padx=10, pady=5)
        
        ttk.Label(file_group, text="Excel File:").grid(row=0, column=0, sticky='w', padx=5)
        ttk.Entry(file_group, textvariable=self.excel_filename, width=30).grid(row=0, column=1, padx=5, sticky='w')
        ttk.Button(file_group, text="Browse", command=self.browse_file).grid(row=0, column=2, padx=5)
        
        # Thickness Interval Settings
        interval_group = ttk.LabelFrame(conn_frame, text="Thickness Reading Interval", padding=10)
        interval_group.pack(fill='x', padx=10, pady=5)
        
        ttk.Label(interval_group, text="Interval (seconds):").grid(row=0, column=0, sticky='w', padx=5)
        interval_entry = ttk.Entry(interval_group, textvariable=self.thickness_interval, width=10)
        interval_entry.grid(row=0, column=1, padx=5, sticky='w')
        ttk.Button(interval_group, text="Set Interval", command=self.set_thickness_interval).grid(row=0, column=2, padx=10)
        
        # Quick interval buttons
        ttk.Button(interval_group, text="1 min", command=lambda: self.quick_set_interval(60)).grid(row=1, column=0, padx=5, pady=5)
        ttk.Button(interval_group, text="5 min", command=lambda: self.quick_set_interval(300)).grid(row=1, column=1, padx=5, pady=5)
        ttk.Button(interval_group, text="10 min", command=lambda: self.quick_set_interval(600)).grid(row=1, column=2, padx=5, pady=5)
        ttk.Button(interval_group, text="30 min", command=lambda: self.quick_set_interval(1800)).grid(row=1, column=3, padx=5, pady=5)
        
        # Control Buttons
        control_group = ttk.LabelFrame(conn_frame, text="Data Logging Control", padding=10)
        control_group.pack(fill='x', padx=10, pady=5)
        
        ttk.Button(control_group, text="Start Logging", command=self.start_logging).grid(row=0, column=0, padx=5)
        ttk.Button(control_group, text="Stop Logging", command=self.stop_logging).grid(row=0, column=1, padx=5)
        ttk.Button(control_group, text="Calibrate Sensors", command=self.calibrate_sensors).grid(row=0, column=2, padx=5)
        ttk.Button(control_group, text="Save Data Now", command=self.save_data_now).grid(row=0, column=3, padx=5)
    
    def create_thickness_tab(self, parent):
        thickness_frame = ttk.Frame(parent)
        parent.add(thickness_frame, text="Thickness Readings")
        
        # Instructions
        instructions = ttk.LabelFrame(thickness_frame, text="Instructions", padding=10)
        instructions.pack(fill='x', padx=10, pady=5)
        
        instruction_text = """
        When prompted for thickness readings:
        1. Measure the pipe thickness at three different points using your ultrasonic gauge
        2. Enter the three readings in the fields below (in millimeters)
        3. Click 'Submit Readings' to send to Arduino
        
        The system will automatically prompt for readings based on the interval you set.
        """
        ttk.Label(instructions, text=instruction_text, wraplength=700).pack(anchor='w')
        
        # Thickness Reading Input
        reading_group = ttk.LabelFrame(thickness_frame, text="Current Thickness Readings", padding=10)
        reading_group.pack(fill='x', padx=10, pady=5)
        
        # Input fields
        ttk.Label(reading_group, text="Point 1 (mm):").grid(row=0, column=0, sticky='w', padx=5, pady=5)
        self.point1_entry = ttk.Entry(reading_group, textvariable=self.thickness_point1, width=15)
        self.point1_entry.grid(row=0, column=1, padx=5, pady=5, sticky='w')
        
        ttk.Label(reading_group, text="Point 2 (mm):").grid(row=0, column=2, sticky='w', padx=5, pady=5)
        self.point2_entry = ttk.Entry(reading_group, textvariable=self.thickness_point2, width=15)
        self.point2_entry.grid(row=0, column=3, padx=5, pady=5, sticky='w')
        
        ttk.Label(reading_group, text="Point 3 (mm):").grid(row=0, column=4, sticky='w', padx=5, pady=5)
        self.point3_entry = ttk.Entry(reading_group, textvariable=self.thickness_point3, width=15)
        self.point3_entry.grid(row=0, column=5, padx=5, pady=5, sticky='w')
        
        # Submit button
        self.submit_btn = ttk.Button(reading_group, text="Submit Readings", command=self.submit_thickness_readings)
        self.submit_btn.grid(row=1, column=2, columnspan=2, pady=10)
        self.submit_btn.config(state='disabled')
        
        # Status display
        self.thickness_status = tk.StringVar(value="No readings requested")
        ttk.Label(reading_group, textvariable=self.thickness_status, font=('TkDefaultFont', 9, 'italic')).grid(row=2, column=0, columnspan=6, pady=5)
        
        # Recent Readings Display
        recent_group = ttk.LabelFrame(thickness_frame, text="Recent Readings History", padding=10)
        recent_group.pack(fill='both', expand=True, padx=10, pady=5)
        
        # Treeview for recent readings
        columns = ('Time', 'Point 1', 'Point 2', 'Point 3', 'Average')
        self.thickness_tree = ttk.Treeview(recent_group, columns=columns, show='headings', height=10)
        
        for col in columns:
            self.thickness_tree.heading(col, text=col)
            self.thickness_tree.column(col, width=120)
        
        thickness_scrollbar = ttk.Scrollbar(recent_group, orient='vertical', command=self.thickness_tree.yview)
        self.thickness_tree.configure(yscrollcommand=thickness_scrollbar.set)
        
        self.thickness_tree.pack(side='left', fill='both', expand=True)
        thickness_scrollbar.pack(side='right', fill='y')
        
        # Manual reading request
        manual_group = ttk.LabelFrame(thickness_frame, text="Manual Control", padding=10)
        manual_group.pack(fill='x', padx=10, pady=5)
        
        ttk.Button(manual_group, text="Request Thickness Reading Now", 
                  command=self.request_manual_thickness).pack(side='left', padx=5)
        ttk.Button(manual_group, text="Clear Recent Readings", 
                  command=self.clear_thickness_history).pack(side='left', padx=5)
    
    def create_monitoring_tab(self, parent):
        monitor_frame = ttk.Frame(parent)
        parent.add(monitor_frame, text="Data Monitoring")
        
        # Current sensor values
        current_group = ttk.LabelFrame(monitor_frame, text="Current Sensor Values", padding=10)
        current_group.pack(fill='x', padx=10, pady=5)
        
        # Create labels for current values
        self.current_temp = tk.StringVar(value="-- °C")
        self.current_humidity = tk.StringVar(value="-- %")
        self.current_magnetic = tk.StringVar(value="-- Gauss")
        self.current_current = tk.StringVar(value="-- A")
        self.current_avg_thickness = tk.StringVar(value="-- mm")
        
        ttk.Label(current_group, text="Temperature:").grid(row=0, column=0, sticky='w', padx=5)
        ttk.Label(current_group, textvariable=self.current_temp, font=('TkDefaultFont', 10, 'bold')).grid(row=0, column=1, sticky='w', padx=5)
        
        ttk.Label(current_group, text="Humidity:").grid(row=0, column=2, sticky='w', padx=15)
        ttk.Label(current_group, textvariable=self.current_humidity, font=('TkDefaultFont', 10, 'bold')).grid(row=0, column=3, sticky='w', padx=5)
        
        ttk.Label(current_group, text="Magnetic Field:").grid(row=1, column=0, sticky='w', padx=5)
        ttk.Label(current_group, textvariable=self.current_magnetic, font=('TkDefaultFont', 10, 'bold')).grid(row=1, column=1, sticky='w', padx=5)
        
        ttk.Label(current_group, text="Current:").grid(row=1, column=2, sticky='w', padx=15)
        ttk.Label(current_group, textvariable=self.current_current, font=('TkDefaultFont', 10, 'bold')).grid(row=1, column=3, sticky='w', padx=5)
        
        ttk.Label(current_group, text="Avg Thickness:").grid(row=2, column=0, sticky='w', padx=5)
        ttk.Label(current_group, textvariable=self.current_avg_thickness, font=('TkDefaultFont', 10, 'bold')).grid(row=2, column=1, sticky='w', padx=5)
        
        # Recent data display
        data_group = ttk.LabelFrame(monitor_frame, text="Recent Data Records", padding=10)
        data_group.pack(fill='both', expand=True, padx=10, pady=5)
        
        # Treeview for data
        data_columns = ('Time', 'Temp', 'Humidity', 'Magnetic', 'Current', 'Thickness')
        self.data_tree = ttk.Treeview(data_group, columns=data_columns, show='headings', height=15)
        
        for col in data_columns:
            self.data_tree.heading(col, text=col)
            self.data_tree.column(col, width=100)
        
        data_scrollbar = ttk.Scrollbar(data_group, orient='vertical', command=self.data_tree.yview)
        self.data_tree.configure(yscrollcommand=data_scrollbar.set)
        
        self.data_tree.pack(side='left', fill='both', expand=True)
        data_scrollbar.pack(side='right', fill='y')
    
    def create_status_bar(self):
        status_frame = ttk.Frame(self.root)
        status_frame.pack(fill='x', side='bottom')
        
        ttk.Label(status_frame, text="Connection:").pack(side='left', padx=5)
        ttk.Label(status_frame, textvariable=self.connection_status).pack(side='left', padx=5)
        
        ttk.Separator(status_frame, orient='vertical').pack(side='left', fill='y', padx=10)
        
        ttk.Label(status_frame, text="Logging:").pack(side='left', padx=5)
        ttk.Label(status_frame, textvariable=self.logging_status).pack(side='left', padx=5)
        
        ttk.Separator(status_frame, orient='vertical').pack(side='left', fill='y', padx=10)
        
        ttk.Label(status_frame, text="Records:").pack(side='left', padx=5)
        ttk.Label(status_frame, textvariable=self.records_count).pack(side='left', padx=5)
    
    def connect_arduino(self):
        try:
            self.serial_connection = serial.Serial(
                port=self.port.get(),
                baudrate=self.baudrate.get(),
                timeout=1
            )
            time.sleep(2)
            self.connection_status.set("Connected")
            messagebox.showinfo("Success", f"Connected to {self.port.get()}")
            self.logger.info(f"Connected to Arduino on {self.port.get()}")
            
            # Set the current thickness interval
            self.set_thickness_interval()
            
        except serial.SerialException as e:
            messagebox.showerror("Connection Error", f"Failed to connect: {e}")
            self.connection_status.set("Disconnected")
    
    def disconnect_arduino(self):
        if self.serial_connection and self.serial_connection.is_open:
            self.stop_logging()
            self.serial_connection.close()
            self.connection_status.set("Disconnected")
            messagebox.showinfo("Info", "Disconnected from Arduino")
    
    def browse_file(self):
        filename = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", ".xlsx"), ("All files", ".*")]
        )
        if filename:
            self.excel_filename.set(filename)
    
    def quick_set_interval(self, seconds):
        self.thickness_interval.set(seconds)
        self.set_thickness_interval()
    
    def set_thickness_interval(self):
        if not self.serial_connection or not self.serial_connection.is_open:
            messagebox.showwarning("Warning", "Please connect to Arduino first")
            return
        
        interval_ms = self.thickness_interval.get() * 1000
        command = f"interval:{interval_ms}\n"
        
        try:
            self.serial_connection.write(command.encode())
            messagebox.showinfo("Success", f"Thickness interval set to {self.thickness_interval.get()} seconds")
            self.logger.info(f"Thickness interval set to {self.thickness_interval.get()} seconds")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to set interval: {e}")
    
    def request_manual_thickness(self):
        if not self.serial_connection or not self.serial_connection.is_open:
            messagebox.showwarning("Warning", "Please connect to Arduino first")
            return
        
        try:
            self.serial_connection.write(b"request_thickness\n")
            self.thickness_status.set("Thickness reading requested - please enter measurements")
            self.waiting_for_thickness = True
            self.submit_btn.config(state='normal')
            self.logger.info("Manual thickness reading requested")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to request thickness reading: {e}")
    
    def submit_thickness_readings(self):
        if not self.serial_connection or not self.serial_connection.is_open:
            messagebox.showwarning("Warning", "Please connect to Arduino first")
            return
        
        try:
            p1 = self.thickness_point1.get()
            p2 = self.thickness_point2.get()
            p3 = self.thickness_point3.get()
            
            if not (0 < p1 <= 100 and 0 < p2 <= 100 and 0 < p3 <= 100):
                messagebox.showerror("Error", "All thickness values must be between 0 and 100 mm")
                return
            
            command = f"thickness:{p1:.3f},{p2:.3f},{p3:.3f}\n"
            self.serial_connection.write(command.encode())
            
            # Add to history display
            current_time = datetime.datetime.now().strftime("%H:%M:%S")
            avg = (p1 + p2 + p3) / 3
            self.thickness_tree.insert('', 0, values=(current_time, f"{p1:.3f}", f"{p2:.3f}", f"{p3:.3f}", f"{avg:.3f}"))
            
            # Reset form
            self.thickness_point1.set(0)
            self.thickness_point2.set(0)
            self.thickness_point3.set(0)
            self.submit_btn.config(state='disabled')
            self.waiting_for_thickness = False
            self.thickness_status.set("Readings submitted successfully")
            
            self.logger.info(f"Thickness readings submitted: P1={p1}, P2={p2}, P3={p3}, AVG={avg:.3f}")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to submit readings: {e}")
    
    def clear_thickness_history(self):
        for item in self.thickness_tree.get_children():
            self.thickness_tree.delete(item)
    
    def start_logging(self):
        if not self.serial_connection or not self.serial_connection.is_open:
            messagebox.showwarning("Warning", "Please connect to Arduino first")
            return
        
        if self.is_logging:
            messagebox.showwarning("Warning", "Logging is already running")
            return
        
        self.is_logging = True
        self.logging_status.set("Running")
        self.logging_thread = threading.Thread(target=self.logging_worker, daemon=True)
        self.logging_thread.start()
        
        messagebox.showinfo("Info", "Data logging started")
        self.logger.info("Data logging started")
    
    def stop_logging(self):
        self.is_logging = False
        self.logging_status.set("Stopped")
        if self.logging_thread and self.logging_thread.is_alive():
            self.logging_thread.join(timeout=2)
        
        # Save any remaining data
        self.save_data_now()
        messagebox.showinfo("Info", "Data logging stopped")
        self.logger.info("Data logging stopped")
    
    def logging_worker(self):
        last_save_time = time.time()
        save_interval = 60  # Save every minute
        
        while self.is_logging and self.serial_connection and self.serial_connection.is_open:
            try:
                if self.serial_connection.in_waiting > 0:
                    line = self.serial_connection.readline().decode('utf-8').strip()
                    if line:
                        self.process_serial_line(line)
                
                # Auto-save periodically
                if time.time() - last_save_time >= save_interval:
                    self.save_data_to_excel()
                    last_save_time = time.time()
                
                time.sleep(0.1)
                
            except Exception as e:
                self.logger.error(f"Logging error: {e}")
                break
    
    def process_serial_line(self, line):
        # Handle thickness requests
        if line == "THICKNESS_REQUEST":
            self.root.after(0, self.handle_thickness_request)
            return
        
        # Handle calibration messages
        if line.startswith("CALIBRATION_"):
            self.root.after(0, lambda: self.logger.info(f"Calibration: {line}"))
            return
        
        # Handle data lines
        match = self.data_pattern.search(line)
        if match:
            try:
                data = {
                    'timestamp_ms': int(match.group(1)),
                    'datetime': datetime.datetime.now(),
                    'temperature_c': float(match.group(2)),
                    'humidity_percent': float(match.group(3)),
                    'magnetic_field_gauss': float(match.group(4)),
                    'current_amps': float(match.group(5)),
                    'thickness_point1': float(match.group(6)),
                    'thickness_point2': float(match.group(7)),
                    'thickness_point3': float(match.group(8)),
                    'avg_thickness_mm': float(match.group(9))
                }
                
                self.data_buffer.append(data)
                self.root.after(0, lambda: self.update_gui_with_data(data))
                
            except ValueError as e:
                self.logger.warning(f"Error parsing data: {e}")
    
    def handle_thickness_request(self):
        self.thickness_status.set("⚠ THICKNESS READING REQUESTED - Please enter measurements below")
        self.waiting_for_thickness = True
        self.submit_btn.config(state='normal')
        
        # Clear previous values
        self.thickness_point1.set(0)
        self.thickness_point2.set(0)
        self.thickness_point3.set(0)
        
        # Focus on first entry field
        self.point1_entry.focus_set()
        
        # Flash the thickness tab
        self.flash_thickness_tab()
    
    def flash_thickness_tab(self):
        # Simple way to draw attention to thickness tab
        messagebox.showinfo("Thickness Reading Required", 
                          "Please go to the 'Thickness Readings' tab and enter your measurements at 3 points.")
    
    def update_gui_with_data(self, data):
        # Update current values display
        self.current_temp.set(f"{data['temperature_c']:.1f} °C")
        self.current_humidity.set(f"{data['humidity_percent']:.1f} %")
        self.current_magnetic.set(f"{data['magnetic_field_gauss']:.1f} Gauss")
        self.current_current.set(f"{data['current_amps']:.3f} A")
        self.current_avg_thickness.set(f"{data['avg_thickness_mm']:.3f} mm")
        
        # Add to data tree (keep only last 100 records)
        time_str = data['datetime'].strftime("%H:%M:%S")
        values = (
            time_str,
            f"{data['temperature_c']:.1f}",
            f"{data['humidity_percent']:.1f}",
            f"{data['magnetic_field_gauss']:.1f}",
            f"{data['current_amps']:.3f}",
            f"{data['avg_thickness_mm']:.3f}"
        )
        
        self.data_tree.insert('', 0, values=values)
        
        # Keep only last 100 records in display
        children = self.data_tree.get_children()
        if len(children) > 100:
            self.data_tree.delete(children[-1])
        
        # Update record count
        self.records_count.set(len(self.data_buffer))
    
    def save_data_now(self):
        if not self.data_buffer:
            messagebox.showinfo("Info", "No data to save")
            return
        
        try:
            self.save_data_to_excel()
            messagebox.showinfo("Success", f"Data saved to {self.excel_filename.get()}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save data: {e}")
    
    def save_data_to_excel(self):
        if not self.data_buffer:
            return
        
        df = pd.DataFrame(self.data_buffer)
        
        # Prepare different sheets
        try:
            with pd.ExcelWriter(self.excel_filename.get(), engine='openpyxl') as writer:
                # Raw data sheet
                df.to_excel(writer, sheet_name='Raw_Data', index=False)
                
                # Training data sheet with additional features
                training_df = self.prepare_training_data(df.copy())
                training_df.to_excel(writer, sheet_name='Training_Data', index=False)
                
                # Three-point thickness analysis
                thickness_df = self.analyze_thickness_data(df.copy())
                thickness_df.to_excel(writer, sheet_name='Thickness_Analysis', index=False)
                
                # Statistics
                stats_df = self.generate_statistics(df)
                stats_df.to_excel(writer, sheet_name='Statistics', index=False)
            
            # Clear buffer after successful save
            self.data_buffer.clear()
            self.logger.info(f"Data saved to {self.excel_filename.get()}")
            
        except Exception as e:
            self.logger.error(f"Error saving to Excel: {e}")
            raise
    
    def prepare_training_data(self, df):
        # Replace error values with NaN
        df = df.replace([-999.0, -9999.0], pd.NA)
        
        # Add time-based features
        df['hour'] = df['datetime'].dt.hour
        df['day_of_week'] = df['datetime'].dt.dayofweek
        df['timestamp_seconds'] = df['timestamp_ms'] / 1000.0
        
        # Calculate thickness statistics
        df['thickness_std'] = df[['thickness_point1', 'thickness_point2', 'thickness_point3']].std(axis=1)
        df['thickness_range'] = (df[['thickness_point1', 'thickness_point2', 'thickness_point3']].max(axis=1) - 
                                df[['thickness_point1', 'thickness_point2', 'thickness_point3']].min(axis=1))
        
        # Moving averages
        window_size = 10
        for col in ['temperature_c', 'humidity_percent', 'magnetic_field_gauss', 'current_amps']:
            df[f'{col}_ma'] = df[col].rolling(window=window_size, min_periods=1).mean()
        
        # Corrosion rate (change in average thickness over time)
        df = df.sort_values('timestamp_ms')
        df['thickness_change_rate'] = df['avg_thickness_mm'].diff() / df['timestamp_seconds'].diff()
        
        return df
    
    def analyze_thickness_data(self, df):
        # Focus on thickness measurements and their variations
        thickness_cols = ['thickness_point1', 'thickness_point2', 'thickness_point3']
        
        # Calculate statistics for each measurement set
        df['thickness_mean'] = df[thickness_cols].mean(axis=1)
        df['thickness_std'] = df[thickness_cols].std(axis=1)
        df['thickness_min'] = df[thickness_cols].min(axis=1)
        df['thickness_max'] = df[thickness_cols].max(axis=1)
        df['thickness_range'] = df['thickness_max'] - df['thickness_min']
        
        # Identify potentially problematic measurements (high variation)
        df['measurement_quality'] = 'Good'
        high_variation = df['thickness_std'] > 0.5  # More than 0.5mm variation
        df.loc[high_variation, 'measurement_quality'] = 'High_Variation'
        
        return df
    
    def generate_statistics(self, df):
        numeric_cols = ['temperature_c', 'humidity_percent', 'magnetic_field_gauss', 
                       'current_amps', 'thickness_point1', 'thickness_point2', 
                       'thickness_point3', 'avg_thickness_mm']
        
        stats = df[numeric_cols].describe()
        stats.loc['missing_count'] = df[numeric_cols].isna().sum()
        stats.loc['missing_percent'] = (df[numeric_cols].isna().sum() / len(df)) * 100
        
        return stats.transpose().reset_index()
    
    def calibrate_sensors(self):
        if not self.serial_connection or not self.serial_connection.is_open:
            messagebox.showwarning("Warning", "Please connect to Arduino first")
            return
        
        try:
            self.serial_connection.write(b"calibrate\n")
            messagebox.showinfo("Calibration", 
                              "Calibration started. Ensure no magnetic field or current near sensors.\n"
                              "Check the Data Monitoring tab for calibration results.")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to start calibration: {e}")


def main():
    root = tk.Tk()
    app = CorrosionMonitorGUI(root)
    
    # Handle window closing
    def on_closing():
        if app.is_logging:
            if messagebox.askokcancel("Quit", "Data logging is running. Stop and quit?"):
                app.stop_logging()
                app.disconnect_arduino()
                root.destroy()
        else:
            app.disconnect_arduino()
            root.destroy()
    
    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.mainloop()


if _name_ == "_main_":
    # Check for required packages
    try:
        import tkinter as tk
        from tkinter import ttk, messagebox, filedialog
        import serial
        import pandas as pd
        import openpyxl
    except ImportError as e:
        print("Missing required packages. Please install with:")
        print("pip install pyserial pandas openpyxl")
        exit(1)
    
    main()