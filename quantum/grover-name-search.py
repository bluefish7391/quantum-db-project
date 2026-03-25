import sys
import math
from qiskit import QuantumCircuit, transpile
from qiskit.circuit.library import grover_operator, ZGate
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

# Controls size of data to be search
DB_SIZE = 64
name_to_index = {str(i): i for i in range(DB_SIZE)}

def grover_search_by_name(query_name: str):
    if query_name not in name_to_index:
        return {"found": False, "id": None, "index": None}

    target_index = name_to_index[query_name]
    
    n = math.ceil(math.log2(DB_SIZE))
    num_iterations = round(math.pi / 4 * math.sqrt(2**n))

    oracle = QuantumCircuit(n)
    bin_str = f"{target_index:0{n}b}"
    for i, bit in enumerate(reversed(bin_str)):
        if bit == '0':
            oracle.x(i)
    oracle.append(ZGate().control(n - 1), range(n))
    for i, bit in enumerate(reversed(bin_str)):
        if bit == '0':
            oracle.x(i)

    qc = QuantumCircuit(n)
    qc.h(range(n))
    for _ in range(num_iterations):
        qc.compose(grover_operator(oracle), inplace=True)

    qc.measure_all()

    service = QiskitRuntimeService()
    backend = service.least_busy(operational=True, simulator=False)
    transpiled_qc = transpile(qc, backend=backend, optimization_level=3)
    
    print(f"Original depth: {qc.depth()}")
    print(f"Transpiled depth: {transpiled_qc.depth()} on {backend.name}")

    sampler = Sampler(mode=backend)
    job = sampler.run([transpiled_qc])
    print(f"Job ID: {job.job_id()}")
    print("Waiting for results (will probably take a sec)")
    
    return job.result()

if __name__ == "__main__":
    query = sys.argv[1]
    result = grover_search_by_name(query)
    print(result)